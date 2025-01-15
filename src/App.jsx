import { useState } from "react";

const barangBelanjaan = [
  {
    id: 1,
    nama: 'Kopi Bubuk',
    jumlah: 2,
    checked: true,
  },
  {
    id: 2,
    nama: 'Gula Pasir',
    jumlah: 5,
    checked: false,
  },
  {
    id: 3,
    nama: 'Air Mineral',
    jumlah: 3,
    checked: false,
  },
];

export default function App() {
  const [belanjaan, setBelanjaan] = useState(barangBelanjaan);

  function handleTambahBarang(brgBaru) {
    setBelanjaan([...belanjaan, brgBaru]);
  }

  function handleHapusBarang(idBarang) {
    setBelanjaan((belanjaan) => belanjaan.filter(brg => brg.id !== idBarang));
  }

  function handleCeklis(idBarang) {
    setBelanjaan((belanjaan) => belanjaan.map((brg) => (brg.id === idBarang ? {...brg, checked: !brg.checked} : brg )));
  }

  function handleBersihkanBarang() {
    setBelanjaan([]);
  }

  return (
    <div className="app">
      <Header />
      <Formulir onTambahBarang={handleTambahBarang} />
      <DaftarBelanja belanjaan={belanjaan} onHapusBarang={handleHapusBarang} onCeklis={handleCeklis} onBersihkan={handleBersihkanBarang} />
      <Footer belanjaan={belanjaan} />
    </div>
  )
}

function Header() {
  return <h1>Catatan Belanjaku 📝</h1>;
}

function Formulir({onTambahBarang}) {
  const [jumlah, setJumlah] = useState('');
  const [nama, setNama] = useState('');

  function handleKirim(e) {
    e.preventDefault();

    if (!nama || !jumlah) return;

    const barangBaru = { nama, jumlah, checked: false, id: Date.now() };
    onTambahBarang(barangBaru);
    console.log(barangBaru);

    setJumlah('');
    setNama('');
  }

  return (
    <form className="add-form" onSubmit={handleKirim}>
      <h3>Hari ini belanja apa kita?</h3>
      <div>
        <input type="text" placeholder="jumlah barang..." value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} />
        <input type="text" placeholder="nama barang..." value={nama} onChange={(e) => setNama(e.target.value)} />
      </div>
      <button>Tambah</button>
    </form>
  );
}

function DaftarBelanja({belanjaan, onHapusBarang, onCeklis, onBersihkan}) {
  const [urutkan, setUrutkan] = useState('input');
  let barangTerurut;

  switch (urutkan) {
    case 'input':
      barangTerurut = belanjaan;
      break;
    
    case 'qty':
      barangTerurut = belanjaan.slice().sort((a, b) => a.jumlah - b.jumlah);
      break;

    case 'name':
      barangTerurut = belanjaan.slice().sort((a, b) => a.nama.localeCompare(b.nama));
      break;

    case 'checked':
      barangTerurut = belanjaan.slice().sort((a, b) => a.checked - b.checked);
      break;

    default:
      barangTerurut = belanjaan;
      break;
  }

  return (
    <>
      <div className="list">
        <ul>
          {barangTerurut.map((barang) => (
            <Barang barang={barang} key={barang.id} onHapusBarang={onHapusBarang} onCeklis={onCeklis} />
          ))}
        </ul>
      </div>
      <div className="actions">
        <select value={urutkan} onChange={(e) => setUrutkan(e.target.value)}>
          <option value="input">Urutkan berdasarkan urutan input</option>
          <option value="qty">Urutkan berdasarkan jumlah barang</option>
          <option value="name">Urutkan berdasarkan nama barang</option>
          <option value="checked">Urutkan berdasarkan ceklis</option>
        </select>
        <button onClick={onBersihkan}>Bersihkan Daftar</button>
      </div>
    </>
  );
}

function Barang({barang, onHapusBarang, onCeklis}) {
    return (
    <li key={barang.id}>
      <input type="checkbox" checked={barang.checked} onChange={() => onCeklis(barang.id)} />
      <span style={ barang.checked ? { textDecoration: "line-through" } : {}}>{barang.jumlah} {barang.nama}</span>
      <button onClick={() => onHapusBarang(barang.id)}>&times;</button>
    </li>
  )
}

function Footer({belanjaan}) {
  if (belanjaan.length === 0)
    return <footer className="stats">Daftar belanjaan masih kosong</footer>;

  const jumlahBarang = belanjaan.length;
  const jmlBrgTerbeli = belanjaan.filter(brg => brg.checked).length;
  const persenTerbeli = Math.round(jmlBrgTerbeli / jumlahBarang * 100);

  return <footer className="stats">Ada {jumlahBarang} barang di daftar belanjaan, {jmlBrgTerbeli} barang sudah dibeli ({persenTerbeli}%)</footer>;
}