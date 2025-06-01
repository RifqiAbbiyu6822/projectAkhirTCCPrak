import Camera from "../models/Camera.js";

export const getCameras = async (req, res) => {
  try {
    const cameras = await Camera.findAll();
    res.json(cameras);
  } catch (error) {
    console.error('Error in getCameras:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findByPk(req.params.id);
    if (!camera) return res.status(404).json({ msg: "Camera tidak ditemukan" });
    res.json(camera);
  } catch (error) {
    console.error('Error in getCameraById:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createCamera = async (req, res) => {
  try {
    const newCamera = await Camera.create(req.body);
    res.status(201).json(newCamera);
  } catch (error) {
    console.error('Error in createCamera:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateCamera = async (req, res) => {
  try {
    const [updated] = await Camera.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ msg: "Camera tidak ditemukan" });
    res.json({ msg: "Camera berhasil diupdate" });
  } catch (error) {
    console.error('Error in updateCamera:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteCamera = async (req, res) => {
  try {
    const deleted = await Camera.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ msg: "Camera tidak ditemukan" });
    res.json({ msg: "Camera berhasil dihapus" });
  } catch (error) {
    console.error('Error in deleteCamera:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};