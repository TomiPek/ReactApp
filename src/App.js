import "./App.css";
import { useState, useEffect } from "react";
import React from "react";
import MaterialTable from "material-table"; // Material table: https://material-table.com/#/
import { Jumbotron } from "react-bootstrap"; // Jumbotron käyttöön
import { Container } from "react-bootstrap"; // Container taulukolle ja jumbotronille
import Button from "@material-ui/core/Button"; // material ui sivustolta nappi

function App() {
  const [data, setData] = useState([]); // usestate ja siihen data muuttuja taulukon päivitystä varten

  const columns = [
    // Taulukon sisältämät kentät ja otsikot
    { title: "ID", field: "_id" },
    { title: "Name", field: "name" },
    { title: "Borough", field: "borough" },
    { title: "Cuisine", field: "cuisine" },
  ];

  useEffect(() => {
    // useEffect hook. Tämä korvaa aikaisempaa luokka toimintoa
    getData(); // getData ja areadata fetch funktiot
    areaData();
  }, []);

  const getData = () => {
    // Haetaan kaikki ravintolat. Todellisuudessa backendissä tämä on rajoitettu, että haetaan vain 20
    fetch("https://mernprojekti3.herokuapp.com/api/getall")
      .then((response) => response.json())
      .then((receiveData) => setData(receiveData));
  };

  const areaData = () => {
    // Haetaan Queens alueelta ravintolat. Tämä on backendissä rajoitettu, että haetaan vain 5
    fetch(" https://mernprojekti3.herokuapp.com/api/alue/Queens")
      .then((response) => response.json())
      .then((receiveData) => setData(receiveData));
  };
  return (
    <div className="App">
      <div className="container">
        <Jumbotron fluid>
          <Container>
            <h1>React Project</h1>
            <Button onClick={areaData} variant="outlined" color="primary">
              Queens area
            </Button>
            <p></p>
            <Button onClick={getData} variant="outlined" color="primary">
              Get all
            </Button>
          </Container>
        </Jumbotron>
      </div>
      <div className="container">
        <MaterialTable
          title="Restaurant data "
          data={data} // Data, jota haetaan taulukkoon
          columns={columns} // Aikaisemmin määritellyt kentät ja otsikot
          editable={{
            // Lisää uusi ravintola + painikkeesta taulukkoon
            onRowAdd: (newRow) =>
              new Promise((resolve, reject) => {
                // Callback funktio, jolla pitää olla kaksi parametriä
                const updatedRows = [...data, newRow]; // Tallenetaan muutokset
                setTimeout(() => {
                  setData(updatedRows);
                  resolve();
                }, 2000); // Pieni viive taulukon päivityksessä, että sitä ei pysty spammaa vahingossa. Ei kuitenkaan pakollinen
                console.log(newRow);
              }),
            onRowDelete: (
              selectedRow // Taulukosta datan deletointi toiminto.
            ) =>
              new Promise((resolve, reject) => {
                const index = selectedRow.tableData.id; // Tallennetaan index muuttujaan valitun rivin id
                const updatedRows = [...data]; // updatedRows muuttujaan tallennetaan uusi data
                updatedRows.splice(index, 1); // Splice funktio poistamista varten
                setTimeout(() => {
                  setData(updatedRows); // asetetaan setData parametreiksi uusi rivi
                  resolve();
                }, 2000);
              }),
            onRowUpdate: (
              updatedRow,
              oldRow // Taulukon kenttien päivitys toiminto
            ) =>
              new Promise((resolve, reject) => {
                const index = oldRow.tableData.id; // Tallennetaan index muuttujaan nykyisen rivin id
                const updatedRows = [...data]; // updatedRows muuttujaan tallennetaan uusi data
                updatedRows[index] = updatedRow;
                setTimeout(() => {
                  setData(updatedRows); // asetetaan setData parametreiksi uusi rivi
                  resolve();
                }, 2000);
              }),
          }}
          options={{
            actionsColumnIndex: -1, // Columnin kenttien korjaus oikeille paikoille siirtämällä tietojen muutoksen hyväksyminen toiseen kohtaan taulukossa.
          }}
        />
      </div>
    </div>
  );
}

export default App;
