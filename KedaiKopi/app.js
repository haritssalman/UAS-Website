document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Kopi Aceh Gayo", img: "1.jpg", price: 231000 },
      { id: 2, name: "Kopi Toraja", img: "2.jpg", price: 176000 },
      { id: 3, name: "Kopi Papua Wamena", img: "5.jpg", price: 319000 },
      { id: 4, name: "Kopi Java Preanger", img: "4.jpg", price: 135000 },
      { id: 5, name: "Kopi Gayo Wine", img: "3.jpg", price: 280000 },
      { id: 6, name: "Kopi Flores Bajawa", img: "6.jpg", price: 165000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // Cek apakah ada barang yang sama pada cart
      const cartItem = this.items.find((item) => item.id === newItem.id);
      // Jika belum ada pada cart (cart kosong)
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang sudah ada, maka akan mengecek apakah barang beda atau sama pada cart
        this.items = this.items.map((item) => {
          // Jika barang belum ada pada cart
          if (item.id !== newItem.id) {
            return item;
          } else {
            // Jika barang sudah ada pada cart
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // Ambil item yang ingin di remove pada cart berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);
      // Jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // Telusuri satu persatu
        this.items = this.items.map((item) => {
          // Jika bukan barang yang tdak di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jik barang sisa satu pada cart
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");
form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim data ketika button checkout di klik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open("http://wa.me/6283873336641?text=" + encodeURIComponent(message));
  console.log(objData);
});

// Format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Pelanggan

Nama : ${obj.name}
Email : ${obj.email}
No HP : ${obj.phone}

Data Pesanan

${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
TOTAL: ${rupiah(obj.total)}
Terimakasih...`;
};

// Konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Format pesan contact page
document.addEventListener("DOMContentLoaded", function () {
  const btnKirim = document.querySelector(".btn");
  btnKirim.addEventListener("click", function () {
    // Ambil nilai dari input
    const nama = document.querySelector('input[placeholder="Nama"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const telp = document.querySelector('input[placeholder="Telp"]').value;
    const pesan = document.querySelector('input[placeholder="Pesan"]').value;
    // Bangun URL Wame dengan parameter pesan
    const baseUrl = "https://wa.me/";
    const phone = "6283873336641"; // Ganti dengan nomor WhatsApp tujuan
    const message = encodeURIComponent(`Pesan Komentar dari... 
    
Nama : ${nama}
Email : ${email}
Telp : ${telp}

Pesan saya : ${pesan}`);

    const finalUrl = `${baseUrl}${phone}?text=${message}`;

    // Buka link Wame
    window.open(finalUrl, "_blank");
  });
});
