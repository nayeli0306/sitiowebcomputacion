import {collection, getDocs, query, doc, deleteDoc, where, onSnapshot,} from "firebase/firestore";

import React, { useEffect, useState } from "react";
import  { db } from "./Componentes/firebase";
import AppForm from "./Componentes/AppForm";
import {toast} from 'react-toastify';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App(){
  //////////////////READ///////////////////
  const [idActual, setIdActual] = useState("");
  const [docsBD, setDocsBD] = useState([]);
  const [orden, setOrden] = useState (0);
  const i = 1;

  /////////////LECTURA A BD///////////////
  useEffect( () => {
    const xCollectionConQuery =  query(collection(db, "persona"), where ("nombre", "!=", ""));
    const unsubscribe = onSnapshot(xCollectionConQuery, (xDatosBD)=>{
      const xDoc  = [];
      xDatosBD.forEach((doc) => {
        xDoc.push({id: doc.id, ...doc.data()})
      });
      setDocsBD(xDoc); 
    });
  }, [idActual]);
 

  const fnDelete = async (xId) =>{
    if(window.confirm("Confirme para elimminar")){
      await deleteDoc(doc(db, 'persona', xId));
      toast("Documento ELIMINADO con exito",{
        type:'error',
        autoClose: 2000
      })
    }
  }

  return (
    <div className="container text-center">
      <div className="card bs-secondary p-3 mt-3">

        <ToastContainer />

      <div className="card border-warning mb-3">
        <div className="card mb-1">
          <h1> sitiocopia2 (App.js)</h1>
      </div>
    </div>
    
    <div className="col-md-12 p-2">
      <AppForm {...{idActual, setIdActual}}/>
    </div>
      
    <div className="col-md-12 p-2"> 
      {
        docsBD.map( (p) =>
        <div className="card mb-1" key={p.id}>
          <div className="card-body"> 
            <div className="d-flex justify-content-between"> 
              <h4>N.{i} - {p.nombre}</h4>
              <div>
                <i className="material-icons text-danger"
                onClick={() => fnDelete(p.id)}>close</i>

                ----

                <i className="material-icons text-warning"
                onClick={() => setIdActual(p.id)}>create</i>
              </div>
            </div> 
            <div className="d-flex justify-content">
              <span>Edad: {p.edad}</span>...
              <a href="#"> Género: {p.genero}</a>
            </div> 
          </div>
        </div>
        )
      }
    </div> 
  </div>
</div>
);
}

export default App;