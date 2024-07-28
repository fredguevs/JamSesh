import { insertAudio, getAllAudios, getAudioById, getAudiosByUser, deleteAudio, updateAudio } from '../../models/audio/audioModel.js';

export const createAudio = async (req, res) => {
  const { title, owner, caption } = req.body;
  if (req.session.user?.username !== owner) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const url = req.file ? req.file.path : null;

  try {
    if (req.session.user?.username !== owner) {
      console.log('Username:', owner);
      console.log('Session User:', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }
    const newAudio = await insertAudio(title, url, owner, caption);
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
    if (req.session.user?.username !== audio.owner) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const deletedAudio = await deleteAudio(audioid);
    res.status(200).json({ message: 'Audio deleted successfully', audio: deletedAudio });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const modifyAudio = async (req, res) => {
  const { audioid } = req.params;
  const { caption } = req.body;
  try {
    const audio = await getAudioById(audioid);
    if (req.session.user?.username !== audio.owner) {
      console.log('Username:', audio.owner);
      console.log('Session User:', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updatedAudio = await updateAudio(audioid, caption);
    res.status(200).json({message: 'Successfuly updated audio', audio: updatedAudio});
  }
  catch (err) {
    res.status(500).json({ error: 'Internal Server Error'});
  };
}
