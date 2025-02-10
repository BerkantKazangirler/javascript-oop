const test = document.querySelector("#demo");
const testall = document.querySelector("#demoall");
const aracKM = document.querySelector("#arackm");
const aracHP = document.querySelector("#arachp");
const aracModel = document.querySelector("#aracmodel");
const aracMarka = document.querySelector("#marka");
const üretimyili = document.querySelector("#üretimyili");
const aracRenk = document.querySelector("#aracrenk");
const telefon = document.querySelector("#telefonnum");
const adsoyad = document.querySelector("#adsoyad");
const mail = document.querySelector("#mail");
const aracdurum = document.querySelector("#aracdurum");
const plaka = document.querySelector("#plakauyruk");

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const tarih = new Date();
const ay = tarih.getMonth();
const yil = tarih.getFullYear();
const gün = tarih.getUTCDate();

class Vehicle {
  static idCounter = 1;
  #id;
  #date;
  #model;
  #owner;
  #engine;
  #detail;
  #km = 0;

  constructor(
    vehicleDate,
    vehicleModel,
    vehicleOwner,
    engineDetails,
    vehicledesc,
    vehicleKM
  ) {
    this.#id = Vehicle.idCounter++;
    this.#date = vehicleDate;
    this.#model = {
      year: vehicleModel.year,
      modelName: vehicleModel.modelName,
      company: vehicleModel.company,
    };
    this.#owner = new Owner(
      vehicleOwner.phone,
      vehicleOwner.name,
      vehicleOwner.mail
    );
    this.#engine = new Engine(
      engineDetails.fuel,
      engineDetails.hp,
      engineDetails.gear
    );
    this.#detail = new vDetails(
      vehicledesc.color,
      vehicledesc.traction,
      vehicledesc.warranty,
      vehicledesc.vehicleStatus,
      vehicledesc.plateCountry,
      vehicledesc.trade,
      vehicledesc.from
    );
    this.#km = vehicleKM || 0;
  }

  get vehicleDetails() {
    return {
      id: this.#id,
      owner: { ...this.#owner.ownerDetail },
      vehicle: {
        date: this.#date,
        model: this.#model,
        engine: { ...this.#engine.engineDetails },
        detail: { ...this.#detail.detailInfo },
        km: this.#km,
      },
    };
  }

  changeOwner(newOwner) {
    this.#owner = new Owner(newOwner.phone, newOwner.name, newOwner.mail);
    console.warn(`Araç sahibi ${newOwner.name} olarak güncellendi`);
  }
}

class Owner {
  #phone;
  #name;
  #mail;

  constructor(phone, name, mail) {
    this.#phone = phone;
    this.#name = name;
    this.#mail = mail;
  }

  get ownerDetail() {
    return {
      phone: this.#phone,
      name: this.#name,
      mail: this.#mail,
    };
  }
}

class vDetails {
  #color;
  #traction;
  #warranty;
  #vehicleStatus;
  #plateCountry;
  #trade;
  #from;

  constructor(
    color,
    traction,
    warranty,
    vehicleStatus,
    plateCountry,
    trade,
    from
  ) {
    this.#color = color;
    this.#traction = traction;
    this.#warranty = warranty || false;
    this.#vehicleStatus = vehicleStatus;
    this.#plateCountry = plateCountry;
    this.#trade = trade || false;
    this.#from = from;
  }

  get detailInfo() {
    return {
      color: this.#color,
      traction: this.#traction,
      warranty: this.#warranty,
      vehicleStatus: this.#vehicleStatus,
      plateCountry: this.#plateCountry,
      trade: this.#trade,
      from: this.#from,
    };
  }
}

class Engine {
  #fuel;
  #hp;
  #gear;

  constructor(fuel, hp, gear) {
    this.#fuel = fuel;
    this.#hp = hp;
    this.#gear = gear;
  }

  get engineDetails() {
    return {
      fuel: this.#fuel,
      hp: this.#hp || 0,
      gear: this.#gear,
    };
  }
}

class AracFilosu {
  #vehicles;

  constructor() {
    this.#vehicles = new Map();
  }

  addVehicle(
    date,
    model = {},
    owner = {},
    engineDetails = {},
    vehicledesc = {},
    km = 0
  ) {
    const newVehicle = new Vehicle(
      date,
      model,
      owner,
      engineDetails,
      vehicledesc,
      km
    );
    this.#vehicles.set(newVehicle.vehicleDetails.id, newVehicle);
    return newVehicle.vehicleDetails.id;
  }

  getVehicle(id) {
    const vehicle = this.#vehicles.get(id);
    if (!vehicle) {
      throw new Error("Araç bulunamadı");
    }
    return vehicle;
  }

  allCars() {
    return Array.from(this.#vehicles.values()).map(
      (arac) => arac.vehicleDetails
    );
  }
}

const filo = new AracFilosu();
const savebutton = document.getElementById("savebtn");

savebutton.addEventListener("click", () => {
  const newVehicleId = filo.addVehicle(
    `${gün} ${monthNames[ay]} ${yil}`,
    {
      year: üretimyili.value,
      modelName: aracModel.value,
      company: aracMarka.value,
    },
    { phone: telefon.value, name: adsoyad.value, mail: mail.value },
    { fuel: fuel, hp: aracHP.value, gear: gear },
    {
      color: aracRenk.value,
      traction: traction,
      warranty: warranty,
      vehicleStatus: aracdurum.value,
      plateCountry: plaka.value,
      trade: trade,
      from: from,
    },
    aracKM.value
  );

  const vehicleData = filo.getVehicle(newVehicleId).vehicleDetails;

  fetch("http://localhost:3000/datas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vehicleData),
  })
    .then((res) => res.json())
    .finally(loadDatas());

  test.innerHTML = JSON.stringify(filo.allCars(), null, 2);
});

document.addEventListener("DOMContentLoaded", () => {
  loadDatas();
});

var fuel, traction, from, warranty, trade, gear;

function selectFuel(browser) {
  fuel = browser;
}

function selectTraction(browser) {
  traction = browser;
}

function selectFrom(browser) {
  from = browser;
}

function selectWarranty(browser) {
  warranty = browser;
}

function selectTrade(browser) {
  trade = browser;
}

function selectGear(browser) {
  gear = browser;
}

var ownerNames,
  models = [];

function loadDatas() {
  fetch("http://localhost:3000/datas")
    .then((res) => res.json())
    .then((data) => {
      ownerNames = data.map((item) => item.owner.name);
      models = data.map((item) => item.vehicle.model.modelName);
      console.log(models);

      testall.innerHTML = `<pre>${ownerNames.join(", ")}</pre>`;
    })
    .catch((error) => console.error("Veri yüklenirken hata oluştu:", error));
}
