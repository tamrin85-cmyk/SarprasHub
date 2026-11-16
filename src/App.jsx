import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { LogOut, Trash2, Plus, Box, Package } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inventoryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(inventoryData);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (error) { alert('Login gagal: ' + error.message); }
  };

  const handleLogout = () => signOut(auth);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName || !newItemQty) return;
    try {
      await addDoc(collection(db, 'inventory'), {
        name: newItemName,
        qty: Number(newItemQty),
        createdAt: serverTimestamp()
      });
      setNewItemName(''); setNewItemQty('');
    } catch (error) { alert("Gagal menambah data!"); }
  };

  const handleDeleteItem = async (id) => {
    if(window.confirm('Hapus barang ini?')) {
      await deleteDoc(doc(db, 'inventory', id));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Memuat Sistem...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="clay-card p-10 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-clay-blue p-4 rounded-[24px] clay-btn">
              <Box className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-gray-700 mb-8">Login Sarpras</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-5 py-3 clay-input focus:outline-none" placeholder="Email Admin" />
            </div>
            <div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-5 py-3 clay-input focus:outline-none" placeholder="Password" />
            </div>
            <button type="submit" className="w-full bg-clay-purple text-white font-bold py-3 clay-btn">
              MASUK
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10">
      <div className="clay-card p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-clay-blue p-3 rounded-[20px] clay-btn"><Package className="text-white w-6 h-6"/></div>
          <h1 className="text-xl font-black text-gray-700">SarprasHub</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-clay-pink text-white px-6 py-2 clay-btn font-bold">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="clay-card p-8 h-fit">
          <h2 className="text-lg font-black text-gray-700 mb-6">Tambah Barang</h2>
          <form onSubmit={handleAddItem} className="space-y-5">
            <input type="text" required value={newItemName} onChange={(e) => setNewItemName(e.target.value)} 
              className="w-full px-5 py-3 clay-input focus:outline-none text-sm" placeholder="Nama Barang (Cth: Proyektor)" />
            <input type="number" required min="1" value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)} 
              className="w-full px-5 py-3 clay-input focus:outline-none text-sm" placeholder="Jumlah" />
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-clay-mint text-gray-800 font-bold py-3 clay-btn">
              <Plus className="w-5 h-5" /> SIMPAN
            </button>
          </form>
        </div>

        <div className="clay-card p-8 md:col-span-2">
          <h2 className="text-lg font-black text-gray-700 mb-6">Katalog Inventaris</h2>
          <div className="space-y-4">
            {items.length === 0 ? (
               <p className="text-center text-gray-400 py-10 font-medium">Belum ada barang.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-[#f1f3f6] p-4 rounded-[20px] shadow-[inset_2px_2px_5px_rgba(166,180,200,0.5),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
                  <div>
                    <h3 className="font-bold text-gray-700">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.qty} Unit Tersedia</p>
                  </div>
                  <button onClick={() => handleDeleteItem(item.id)} className="bg-[#f1f3f6] text-red-400 p-3 clay-btn hover:text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}