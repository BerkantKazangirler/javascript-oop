const test = document.querySelector("#demo");
const aracKM = document.querySelector("#arackm");
const aracHP = document.querySelector("#arachp");
const aracModel = document.querySelector("#aracmodel");
const aracMarka = document.querySelector("#marka");
const üretimyili = document.querySelector("#üretimyili");
const aracRenk = document.querySelector("#aracrenk");

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
  #id;
  #date;
  #model;
  #owner;
  #engine;
  #detail;
  #km = 0;
  static #vehicles = 1;

  constructor(
    vehicleDate,
    vehicleModel,
    vehicleOwner,
    engineDetails,
    vehicledesc,
    vehicleKM
  ) {
    this.#id = Vehicle.#vehicles++;
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
      owner: {
        ...this.#owner.ownerDetail,
      },
      vehicle: {
        id: this.#id,
        date: this.#date,
        model: this.#model,
        engine: {
          ...this.#engine.engineDetails,
        },
        detail: {
          ...this.#detail.detailInfo,
        },
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

class AracFilosu extends Vehicle {
  #vehicles;

  constructor(
    date,
    model = {},
    owner = {},
    engineDetails = {},
    vehicledesc = {},
    km
  ) {
    super(date, model, owner, engineDetails, vehicledesc, km);
    this.#vehicles = new Map();
  }

  // Araç ekleme
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
    return Array.from(this.#vehicles.values()).map((arac) => {
      const details = arac.vehicleDetails;
      return {
        owner: {
          ...details.owner,
        },
        vehicle: {
          ...details.vehicle,
        },
      };
    });
  }
}

const filo = new AracFilosu();
const testbtn = document.getElementById("testbtn");

testbtn.addEventListener("click", (e) => {
  // if (üretimyili.value == "") {
  //   throw new Error("Üretim Yılıni Girin");
  // } else if (aracModel.value == "") {
  //   throw new Error("Araç Modelini Girin");
  // } else if (aracMarka.value == "") {
  //   throw new Error("Araç Markasını Girin");
  // } else if (selectedFuel == "") {
  //   throw new Error("Yakıt Tipini Seçin");
  // }
  const aracId = filo.addVehicle(
    gün + " " + monthNames[ay] + " " + yil, // yayın tarihi
    {
      year: üretimyili.value, // üretim yılı
      modelName: aracModel.value, // model
      company: aracMarka.value, // marka
    },
    { phone: 13213531, name: "ahmet", mail: "basdasdada@gmail.com" }, // ilan sahibi bilgileri
    { fuel: fuel, hp: aracHP.value, gear: "Manuel" }, // motor bilgileri
    {
      color: aracRenk.value,
      traction: traction,
      warranty: warranty,
      vehicleStatus: "2.El",
      plateCountry: "TR",
      trade: trade,
      from: from,
    },
    aracKM.value // araç km
  );

  const arac = filo.getVehicle(aracId);
  arac.changeOwner({
    phone: 99999,
    name: "berkant",
    mail: "asdasda@gmail.com",
  });
  console.log(filo.allCars());

  test.innerHTML = JSON.stringify(filo.allCars());
});

var fuel;
var traction;
var from;
var warranty;
var trade;

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
