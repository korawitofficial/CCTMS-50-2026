import {
  ref, uploadBytes, getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js';
import { storage } from './firebaseConfig.js';

/**
 * StorageService — wraps Firebase Cloud Storage uploads (PART 12 §5/§18).
 * Files are stored under /gallery/{timestamp}_{filename}; adjust the path
 * scheme (e.g. per-tournament folders) as needed.
 */
export const StorageService = {
  async upload(file, folder = 'gallery') {
    if (!file) throw new Error('ไม่พบไฟล์');
    const path = `${folder}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, name: file.name, size: file.size, path };
  },
};
