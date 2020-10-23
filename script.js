const imePromenljive = Promenljiva => Object.keys(Promenljiva)[0];
let divResult = document.getElementById("result");
let inputName = document.getElementById("imeIgraca");
let spanTimer = document.getElementById("timer");
let imeTrenutnogKorisnika="";
let validnoUnesenoKorisnickoIme=false;
let nizKartica = [];
let brojOtvorenihKartica;
let targetPrveOtvorene;
let targetDrugeOtvorene;
let ukupanBrojKartica;
let brojPogodjenih;
let timer = null;
let brojac = 0;
let trenutniNivo;
let nizIgracaLako = [], nizIgracaSrednje = [], nizIgracaTesko = [], nizIgracaEkspert = [];
let nizIgracaLakoStorage = [], nizIgracaSrednjeStorage = [], nizIgracaTeskoStorage = [], nizIgracaEkspertStorage = [];
/*
let nizNizova = [nizIgracaLako, nizIgracaSrednje, nizIgracaTesko, nizIgracaEkspert];
let nizNizovaStorage = [nizIgracaLakoStorage, nizIgracaSrednjeStorage, nizIgracaTeskoStorage, nizIgracaEkspertStorage];
for (let i=0; i<4; i++) {
    // let nizIgraca = nizNizova[i];
    // let nizIgracaStorage = nizNizovaStorage[i];
    if (JSON.parse(localStorage.getItem("nizNizovaStorage[i]")) === null) {
        console.log("Niz pobednika u lokalnoj memoriji je prazan!");
        nizIgraca = [];
        localStorage.setItem("nizNizovaStorage[i]", JSON.stringify(nizIgraca));
    } else {
        nizNizova[i] = JSON.parse(localStorage.getItem("nizNizovaStorage[i]"));
        console.log("Niz pobednika nije prazan. Citam iz lokalne memorije..")
        for( let j = 0; j<nizNizova[i].length; j++) {
            console.log(nizNizova[i][j]);
        }
    }    
}
*/
if (JSON.parse(localStorage.getItem("nizIgracaLakoStorage")) === null) {
    nizIgracaLako = [];     localStorage.setItem("nizIgracaLakoStorage", JSON.stringify(nizIgracaLako));
} else {
    nizIgracaLako = JSON.parse(localStorage.getItem("nizIgracaLakoStorage"));
}
if (JSON.parse(localStorage.getItem("nizIgracaSrednjeStorage")) === null) {
    nizIgracaSrednje = [];     localStorage.setItem("nizIgracaSrednjeStorage", JSON.stringify(nizIgracaSrednje));
} else {
    nizIgracaSrednje = JSON.parse(localStorage.getItem("nizIgracaSrednjeStorage"));
}
if (JSON.parse(localStorage.getItem("nizIgracaTeskoStorage")) === null) {
    nizIgracaTesko = [];     localStorage.setItem("nizIgracaTeskoStorage", JSON.stringify(nizIgracaTesko));
} else {
    nizIgracaTesko = JSON.parse(localStorage.getItem("nizIgracaTeskoStorage"));
}
if (JSON.parse(localStorage.getItem("nizIgracaEkspertStorage")) === null) {
    nizIgracaEkspert = [];     localStorage.setItem("nizIgracaEkspertStorage", JSON.stringify(nizIgracaEkspert));
} else {
    nizIgracaEkspert = JSON.parse(localStorage.getItem("nizIgracaEkspertStorage"));
}

function startujBrojac () {
    if (timer === null) {
        console.log(`Brojac pokrenut od: ${brojac}`);
        console.log(spanTimer);
        timer = setInterval ( () => {
            brojac++;
            spanTimer.innerHTML = brojac;
        }, 1000);
    } else {
        console.log(`Brojac resetovan`);
        brojac=0;
        timer=null;
    }
}
function shuffle (array) {
    let duzinaNiza = array.length;
    let slucajniIndeks=0;
    let pomocna=0;
    for( let i=duzinaNiza-1; i>=2; i--) {
        if(Math.random() > 0.5) {
            slucajniIndeks = Math.trunc(Math.random()*(i-1));
            pomocna = array[i];
            array[i] = array[slucajniIndeks];
            array[slucajniIndeks] = pomocna;
        }
    }
}
function formirajPaPromesaj ( brojParova ) {
    nizKartica=[];
    for (let i = 0; i < brojParova*2; i++) {
        nizKartica.push(i%brojParova + ".ico");  
    }
    shuffle(nizKartica);
    shuffle(nizKartica);
}
function osveziTabelu(niz) {
    document.getElementById("tabelaVecitih").innerHTML="";

    let novaTabela = document.createElement('table');
    let zaglavlje = document.createElement("tr");
    
    let redniBrojZaglavlje = document.createElement("th");
    redniBrojZaglavlje.textContent="Mesto";
    zaglavlje.appendChild(redniBrojZaglavlje);
    
    let korisnickoImeZaglavlje = document.createElement("th");
    korisnickoImeZaglavlje.textContent = "Korisničko ime";
    zaglavlje.appendChild(korisnickoImeZaglavlje);

    let vremeZaglavlje = document.createElement("th");
    vremeZaglavlje.textContent = "Vreme";
    zaglavlje.appendChild(vremeZaglavlje);

    novaTabela.appendChild(zaglavlje);

    for (let i=0; i<niz.length; i++) {
        let noviPobednik=document.createElement("tr");

        let redniBroj = document.createElement("td");
        redniBroj.textContent = `${i+1}.`;
        noviPobednik.appendChild(redniBroj);

        let korisnickoIme = document.createElement("td");
        korisnickoIme.textContent = niz[i].username;      // vreme 
        noviPobednik.appendChild(korisnickoIme);

        let korisnickoVreme = document.createElement("td");
        korisnickoVreme.textContent = niz[i].vreme;
        noviPobednik.appendChild(korisnickoVreme);

        novaTabela.appendChild(noviPobednik);
    }

    document.getElementById("tabelaVecitih").appendChild(novaTabela);
}
let dugmad = document.getElementById("tableSelect");
dugmad.addEventListener ( "click", event => {
    if (event.target.tagName == "BUTTON") {
        let dugme = event.target.id;
        switch(dugme) {
            case 'lako': osveziTabelu(nizIgracaLako); break;
            case 'srednje': osveziTabelu(nizIgracaSrednje); break;
            case 'tesko': osveziTabelu(nizIgracaTesko); break;
            case 'ekspert': osveziTabelu(nizIgracaEkspert);
        }
    }
})
function dodajNaPravoMesto (niz, noviElement) {
    if(niz.length == 0) {
        niz.push(noviElement);
    } else {
        let flag = false;
        let ind;
        let i=0;
        while (i < niz.length && flag == false) {       // nalazi mesto na koje treba da se umetne novi element
            if (niz[i].vreme >= noviElement.vreme) {
                ind = i;
                flag=true;
            } else {
                i++;
                ind = i;
            }
        }
        console.log(ind);
        // let gornjaGranicaPetlje = niz.length;           // cuva trenutnu velicinu niza jer bi se inace menjala u petlji :)
        for (i=niz.length; i>=ind; i--) {
            niz[i+1] = niz[i];
            console.log(i);
        }
        niz[ind] = noviElement;
    }
    if(niz[niz.length-1] == undefined) {
        niz.pop();
    }
    if(niz.length>5) {
        niz.pop();
    }
}
function izabiranjeNivoa( noviNivo) {
    switch (noviNivo) {
        case "lvl1":
            formirajPaPromesaj(8);      iscrtajTabelu(4, nizKartica);       ukupanBrojKartica=16;
            break;
        case "lvl2":
            formirajPaPromesaj(18);     iscrtajTabelu(6, nizKartica);       ukupanBrojKartica=36;
            break;
        case "lvl3":
            formirajPaPromesaj(32);     iscrtajTabelu(8, nizKartica);       ukupanBrojKartica=64;
            break;
        case "lvl4": 
            formirajPaPromesaj(50);     iscrtajTabelu(10, nizKartica);      ukupanBrojKartica=100;
    }
    brojOtvorenihKartica=0;
    brojPogodjenih=0;
}
function iscrtajTabelu (stranicaKvadrata, nizSlicica) {
    divResult.textContent="";
    let newTable = document.createElement("table");
    let nazivKlase = "";
    nazivKlase = "t" + stranicaKvadrata;
    newTable.classList.add(nazivKlase);
    let extraCounter = 0;
    for (let i=0; i<stranicaKvadrata; i++) {
        let newRow = document.createElement("tr");
        for (let j=0; j<stranicaKvadrata; j++) {
            let newData = document.createElement("td");
            newData.style.padding="10px";
            let newDiv = document.createElement("div");
            newDiv.classList.add("podnozjeKarte");
            newDiv.style.display="inline-block";
            let newImg = document.createElement("img");
            newImg.src = "img/" + nizSlicica[extraCounter];
            newImg.alt = nizSlicica[extraCounter];
            newImg.style.display="none";
            newImg.classList.add("slicica");
            let poledjina = document.createElement("img");
            poledjina.classList.add("poledjina");
            poledjina.src = "img/poledjina.ico";
            poledjina.alt = "img/poledjina.ico";
            poledjina.id = nizSlicica[extraCounter];
            extraCounter++;
            newDiv.appendChild(poledjina);
            newDiv.appendChild(newImg);
            newData.appendChild(newDiv);
            newRow.appendChild(newData);        
        }
        newTable.appendChild(newRow);
    }
    divResult.appendChild(newTable);
}
inputName.addEventListener ( "keyup", event => {
    imeTrenutnogKorisnika = inputName.value;
    if (event.keyCode === 13) {
        if (inputName == null || imeTrenutnogKorisnika == "") {
            alert("Unesi validno korisnicko ime");
        } else {
            validnoUnesenoKorisnickoIme=true;
            console.log(`Username je ${imeTrenutnogKorisnika} `);
            let nivo = document.querySelector("input[name='tezina']:checked");
            izabiranjeNivoa(nivo.id);
            startujBrojac();
        }
    }
});
let sviRadioDugmici = document.querySelectorAll("input[name='tezina']")
sviRadioDugmici.forEach ( radioDugme => {
    radioDugme.addEventListener( "click", event => {
        let izbor = radioDugme.id;
        if(validnoUnesenoKorisnickoIme==false) {
            alert("Najpre unesite validno korisnicko ime");
        } else {
            izabiranjeNivoa(izbor);
            timer=0;
            startujBrojac();
        }
    })
});
divResult.addEventListener( "click", event => {
    if (event.target.tagName == "IMG" && !(event.target.classList.contains("bingo"))) {
        let currentImg = event.target;
        console.log(trenutniNivo);
        console.log(ukupanBrojKartica);
        console.log(event);
        console.log(brojOtvorenihKartica);
        console.log(document.querySelectorAll("input[name='tezina']:checked")[0].value);
        if (event.target.src.endsWith("poledjina.ico")) {
            if (brojOtvorenihKartica == 0) {
                event.target.style.display = "none";
                event.target.nextSibling.style.display="inline-block";
                targetPrveOtvorene = event.target.nextSibling;
                console.log(targetPrveOtvorene);
                brojOtvorenihKartica++;
                console.log(brojOtvorenihKartica);
            } else if (brojOtvorenihKartica == 1) {
                event.target.style.display = "none";
                event.target.nextSibling.style.display="inline-block";
                targetDrugeOtvorene = event.target.nextSibling;
                console.log(targetDrugeOtvorene);
                brojOtvorenihKartica++;
                if (targetPrveOtvorene.src === targetDrugeOtvorene.src) {
                    console.log("hit!");
                    brojPogodjenih+=2;
                    brojOtvorenihKartica=0;
                    targetPrveOtvorene.classList.add("bingo");
                    targetDrugeOtvorene.classList.add("bingo");
                    if (brojPogodjenih == ukupanBrojKartica) {
                        let noviPobednik = {
                            username: imeTrenutnogKorisnika,
                            vreme: brojac,
                            nivo: document.querySelectorAll("input[name='tezina']:checked")[0].value
                        };
                        switch(document.querySelectorAll("input[name='tezina']:checked")[0].value) {
                            case 'lako': 
                                dodajNaPravoMesto(nizIgracaLako, noviPobednik);
                                localStorage.setItem("nizIgracaLakoStorage", JSON.stringify(nizIgracaLako));
                                osveziTabelu(nizIgracaLako);
                                break;
                            case 'srednje':
                                dodajNaPravoMesto(nizIgracaSrednje, noviPobednik);
                                localStorage.setItem("nizIgracaSrednjeStorage", JSON.stringify(nizIgracaSrednje));
                                osveziTabelu(nizIgracaSrednje);
                                break;
                            case 'teško':
                                dodajNaPravoMesto(nizIgracaTesko, noviPobednik);
                                localStorage.setItem("nizIgracaTeskoStorage", JSON.stringify(nizIgracaTesko));
                                osveziTabelu(nizIgracaTesko);
                                break;
                            default:
                                dodajNaPravoMesto(nizIgracaEkspert, noviPobednik);
                                localStorage.setItem("nizIgracaEkspertStorage", JSON.stringify(nizIgracaEkspert));
                                osveziTabelu(nizIgracaEkspert);
                        }
                        console.log(noviPobednik);
                        let temp = brojac;
                        brojac = 0;
                        alert (`Čestitamo! Pobedili ste! Vaše vreme: ${temp}`);
                        //location.reload();
                    }
                } else {
                    setTimeout(()  => {
                        console.log(targetPrveOtvorene);
                        console.log(targetDrugeOtvorene);
                        targetPrveOtvorene.style.display = "none";
                        targetPrveOtvorene.previousSibling.style.display="inline-block";
                        brojOtvorenihKartica--;
                        targetDrugeOtvorene.style.display = "none";
                        targetDrugeOtvorene.previousSibling.style.display="inline-block";
                        brojOtvorenihKartica--;
                        targetPrveOtvorene="";
                        targetDrugeOtvorene="";
                    }, 500);                  
                }            
            }
        }
    }
    console.log(`ukupno: ${ukupanBrojKartica}`);
    console.log(`otvoreno: ${brojOtvorenihKartica}`);
    console.log(`pogodjeno: ${brojPogodjenih}`);
});