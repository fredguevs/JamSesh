import { insertAudio, getAllAudios, getAudioById, getAudiosByUser, deleteAudio } from '../../models/audio/audioModel.js';

export const createAudio = async (req, res) => {
  const { title, owner } = req.body;
  if (req.user.username !== owner) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const url = req.file ? req.file.path : null;

  try {
    const newAudio = await insertAudio(title, url, owner);
    res.status(201).json({ message: 'Audio created successfully', audio: newAudio });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fetchAudios = async (req, res) => {
  try {
    const audios = await getAllAudios();
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fetchAudioById = async (req, res) => {
  const { audioid } = req.params;
  try {
    const audio = await getAudioById(audioid);
    res.status(200).json(audio);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fetchAudiosByUser = async (req, res) => {
  const { username } = req.params;
  try {
    const audios = await getAudiosByUser(username);
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeAudio = async (req, res) => {
  const { audioid } = req.params;
  try {
    const audio = await getAudioById(audioid);
    if (req.user.username !== audio.owner) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const deletedAudio = await deleteAudio(audioid);
    res.status(200).json({ message: 'Audio deleted successfully', audio: deletedAudio });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
