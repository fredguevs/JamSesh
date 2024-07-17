import { insertAudio, getAllAudios, getAudioById, getAudiosByUser, deleteAudio } from '../models/audioModel.js';

const addAudio = async (req, res) => {
  const { title, url, owner } = req.body;
  try {
    const newAudio = await insertAudio(title, url, owner);
    res.status(201).json({ message: 'Successfully added audio', audio: newAudio });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchAudios = async (req, res) => {
  try {
    const audios = await getAllAudios();
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchAudioById = async (req, res) => {
  const { audioid } = req.params;
  try {
    const audio = await getAudioById(audioid);
    res.status(200).json(audio);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchAudiosByUser = async (req, res) => {
  const { username } = req.params;
  try {
    const audios = await getAudiosByUser(username);
    res.status(200).json(audios);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removeAudio = async (req, res) => {
  const { audioid } = req.params;
  try {
    const deletedAudio = await deleteAudio(audioid);
    res.status(200).json({ message: 'Successfully deleted audio', audio: deletedAudio });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { addAudio, fetchAudios, fetchAudioById, fetchAudiosByUser, removeAudio };
