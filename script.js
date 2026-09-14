import senga from "./jadwal/senga.js";
import selga from "./jadwal/selga.js";
import rabga from "./jadwal/rabga.js";
import kanga from "./jadwal/kanga.js";
import jumga from "./jadwal/jumga.js";
import sabga from "./jadwal/sabga.js";
import mingga from "./jadwal/mingga.js";

import senge from "./jadwal/senge.js";
import selge from "./jadwal/selge.js";
import rabge from "./jadwal/rabge.js";
import kange from "./jadwal/kange.js";
import jumge from "./jadwal/jumge.js";
import sabge from "./jadwal/sabge.js";
import mingge from "./jadwal/mingge.js";

const semuaJadwal=[
    senga,selga,rabga,kanga,jumga,sabga,mingga,
    senge,selge,rabge,kange,jumge,sabge,mingge
];

function ubahMenit(jam){
    const [h,m]=jam.split(":");
    return Number(h)*60+Number(m);
}

function cekMinggu(tanggal=new Date()){
    const awal=new Date("2026-07-20");
    const selisih=Math.floor(
        (tanggal-awal)/(1000*60*60*24)
    );
    const minggu=Math.floor(selisih/7);
    return minggu%2===0?"Ganjil":"Genap";
}

function namaHari(tanggal=new Date()){
    return[
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ][tanggal.getDay()];
}

function cariJadwal(hari,minggu){
    return semuaJadwal.find(data=>
        data.hari===hari &&
        data.minggu===minggu
    );
}

function tampilDaftar(data,target,indexAktif=-1){
    target.innerHTML="";

    data.jadwal.forEach((item,i)=>{

        const aktif=i===indexAktif?"aktif":"";

        target.innerHTML+=`
        <div class="${aktif}">
            <b>${item.mulai} - ${item.selesai}</b>
            <br>
            ${item.pelajaran}
            ${aktif?`<small>🔴 Sedang berlangsung</small>`:""}
        </div>`;
    });
}

function updateJadwal(){

    const sekarang=new Date();

    const jam=
    String(sekarang.getHours()).padStart(2,"0")
    +":"
    +String(sekarang.getMinutes()).padStart(2,"0");

    document.getElementById("jam").innerHTML=
    "⏰ "+jam;

    document.getElementById("hari").innerHTML=
    "📅 "+sekarang.toLocaleDateString("id-ID",{
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    });

    const minggu=cekMinggu(sekarang);

    document.getElementById("minggu").innerHTML=
    "Minggu "+minggu;

    const jadwal=cariJadwal(
        namaHari(sekarang),
        minggu
    );

    if(!jadwal){
      document.getElementById("runningText").innerHTML=
"🏖️ Hari ini libur • Selamat menikmati waktu istirahat •";

        document.getElementById("pelajaran").innerHTML=
        "Tidak ada jadwal hari ini";

        document.getElementById("waktu").innerHTML="-";
        document.getElementById("berikutnya").innerHTML="-";
        document.getElementById("waktuBerikutnya").innerHTML="-";

        return;
    }

    const menitSekarang=ubahMenit(jam);

    let index=-1;

    jadwal.jadwal.forEach((item,i)=>{

        if(
            menitSekarang>=ubahMenit(item.mulai)&&
            menitSekarang<ubahMenit(item.selesai)
        ){
            index=i;
        }

    });

    if(index!==-1){

        const aktif=jadwal.jadwal[index];

        document.getElementById("pelajaran").innerHTML=
        aktif.pelajaran;

        document.getElementById("waktu").innerHTML=
        aktif.mulai+" - "+aktif.selesai;
        
        document.getElementById("runningText").innerHTML=
`📚 Sedang berlangsung: ${aktif.pelajaran} • ⏰ ${aktif.mulai} - ${aktif.selesai} • Semangat belajar! •`;

        const berikut=jadwal.jadwal[index+1];

        document.getElementById("berikutnya").innerHTML=
        berikut?berikut.pelajaran:"Selesai";

        document.getElementById("waktuBerikutnya").innerHTML=
        berikut?berikut.mulai+" - "+berikut.selesai:"-";

    }else{

        const pertama=jadwal.jadwal[0];
        const terakhir=jadwal.jadwal[jadwal.jadwal.length-1];

        if(menitSekarang<ubahMenit(pertama.mulai)){

            document.getElementById("pelajaran").innerHTML=
            "Belum ada kegiatan";
            
            document.getElementById("runningText").innerHTML=
"🌅 Belum ada kegiatan sekolah • Semoga harimu menyenangkan •";

            document.getElementById("waktu").innerHTML=
            "Mulai "+pertama.mulai;

        }else{

            document.getElementById("pelajaran").innerHTML=
            "Kegiatan sekolah selesai";
            
            document.getElementById("runningText").innerHTML=
"🎉 Kegiatan sekolah selesai • Sampai jumpa besok •";

            document.getElementById("waktu").innerHTML=
            "Sampai besok 👋";
        }

        document.getElementById("berikutnya").innerHTML="-";
        document.getElementById("waktuBerikutnya").innerHTML="-";
    }

    tampilDaftar(
        jadwal,
        document.getElementById("daftarJadwal"),
        index
    );
}

// JADWAL BESOK

function ambilBesok(){

    const tanggal=new Date();
    tanggal.setDate(
        tanggal.getDate()+1
    );

    const hari=namaHari(tanggal);
    const minggu=cekMinggu(tanggal);

    return{
        data:cariJadwal(
            hari,
            minggu
        ),
        hari,
        minggu,
        tanggal
    };

}

document.getElementById("btnBesok").onclick=()=>{

    const panel=document.getElementById("jadwalBesok");
    const isi=document.getElementById("infoBesok");

    panel.classList.toggle("hidden");

    if(panel.classList.contains("hidden"))
        return;

    const besok=ambilBesok();

    isi.innerHTML=`
    <p>
        📅 <b>${besok.hari}</b><br>
        ${besok.tanggal.toLocaleDateString("id-ID",{
            day:"numeric",
            month:"long",
            year:"numeric"
        })}<br>
        Minggu ${besok.minggu}
    </p>
    <hr>
    `;

    if(!besok.data){

        isi.innerHTML+=`
        <p>🎉 Tidak ada jadwal sekolah.</p>
        `;

        return;

    }

    tampilDaftar(
        besok.data,
        isi
    );

    isi.innerHTML=`
    <p>
        📅 <b>${besok.hari}</b><br>
        ${besok.tanggal.toLocaleDateString("id-ID",{
            day:"numeric",
            month:"long",
            year:"numeric"
        })}<br>
        Minggu ${besok.minggu}
    </p>
    <hr>
    `+isi.innerHTML;

};

updateJadwal();

setInterval(
    updateJadwal,
    1000
);