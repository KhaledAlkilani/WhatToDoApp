# WhatToDo projekti

# Tehtävät / ominaisuudet

## 1. Käyttöliittymän päivitys (5 pistettä)
- ### Vaatimukset
  - Päivitä käyttöliittymä siten, että tehtävälistaus esitetään korttimuodossa (kuten esimerkkikuvassa).
  - Pyri käyttöliittymän toteutuksessa **DaisyUI**:ta sekä **TailwindCSS**:ää hyödyntämään.
  - Varmista tehtävien listauksen sujuvuus, esim. tehtävien listaus on toteutettu **paginoinnilla** (määrittele selkeästi, mitä tämä tarkoittaa ja miten se näkyy toteutuksessa).
  - Käyttöliittymän responsiivisuus:
    - Listauksen näkymä vastaa ruudun kokoa riippumatta siitä, millä laitteella käyttäjä käyttää sovellusta.
  - Sovella käyttöliittymän muokkaamiseen mukautuvaa **custom-teemaa** (esim. määrittele värejä, fontteja, tai muita asetuksia esimerkkikuvan perusteella).
    - Määrittele **custom-teeman** varmistamana **DaisyUI**:n teemoja konfiguraatiossa.
  - Tee käyttöliittymästä responsiivinen, siten että se toimii eri laitteilla/näytöillä (esim. mobiili, tabletti, desktop).

---

## 2. Tehtävät kategoriat / ryhmittelyt (5 pistettä)
- ### Vaatimukset
  - Listaa ominaisuuksia, joiden avulla tehtävät löytyvät niiden määriteltyjen kategorioiden perusteella.
    - Tehtävistä tulisi löytyä **taulu**, joka sisältää tehtävien kategoriat.
    - Toteuta käyttöliittymän visuaalinen tapa nähdä kunakin tehtävänä kategorian.
  
  - Mahdollista uuden tehtävän luonnin yhteydessä kategorian määrittäminen.
    - Käyttäjä voi valita jo olemassa olevista kategorioista tai lisätä uuden tarpeen mukaan.
    - Sama toiminnallisuus on estetty virheellisten tietojen osalta.
  
  - Mahdollista kategorian valinta tehtävän muokkauksen yhteydessä.
    - Käyttäjä voi vaihtaa tehtävän tyylikästä tyyliä.
    - Käyttäjä voi valita olemassa olevista kategorioista tai lisätä uuden tarpeen mukaan.
    - Kategorioiden luonti on estetty virheellisten tietojen syöttämiseltä.

---

## 3. Tehtävälistan järjestäminen (5 pistettä)
- ### Vaatimukset
  
  ### Filteröinti
  - Käyttäjä voi filteröidä tehtävälistaa seuraavien kriteerien perusteella:
    - **Nimen mukaan** (hae tehtävän otsikosta).
    - **Ajankohdan mukaan** (valitse aloituspäivämäärä ja/tai loppupäivämäärä).
    - **Tilan mukaan** (esim. "valmis", "keskeneräinen", "suunniteltu").
  
  ### Lajittelu
  - Käyttäjä voi lajitella tehtävät seuraavien kriteerien perusteella:
    - **Nimen mukaan.**
    - **Päivämäärän mukaan** (aloitus- tai päättymispäivä).
    - **Kategorian mukaan.**
  
  - Filteröinti ja lajittelu tulee toteuttaa backendiin, mutta niiden vaikutukset tulee näkyä käyttöliittymässä reaaliajassa.
  
  - Käyttäjän suorittamat valinnat näkyvät filteröinnin/lajittelun kautta:

---

## 4. Tehtävien haku (5 pistettä)
- ### Vaatimukset
  - Lisää hakuominaisuus, jossa käyttäjä voi etsiä tehtäviä nimien/otsikoiden perusteella.
  - Haku tulisi näkyä käyttöliittymässä (esimerkiksi tekstikentän kautta).
  - Toteuta tarvittavat turvamekanismit, kuten syötteen validointi ja SQL-injektioita vastaan.
  - Hakutoiminto sopii yhteen filteröinnin ja järjestämisen kanssa.
