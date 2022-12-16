import {collection, doc, getDoc, addDoc, updateDoc} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {db} from "./firebase";
import 'react-toastify/dist/ReactToastify.css'


const AppForm = (props) => {

  const camposRegistro ={nombre:"", edad:"", genero:""}
  const [objeto, setObjeto] = useState(camposRegistro);

  const controlarEstadoCambio = (e) => {  
      const {name, value} = e.target;
      setObjeto({...objeto,[name]:value});   
  };
  
  const controlSubmit = async (e) => {
      try{
          e.preventDefault();

          if(props.idActual === ""){
              if(validarForm()){
                  addDoc(collection(db, 'persona'),objeto);
                  toast("Se GUARDO con exito",{
                      type:'error',
                      autoClose: 2000  
              })}
          }else{
              await updateDoc(doc(collection(db, "persona"), props.idActual), objeto);
              toast("Se ACTUALIZO con exito...",{
                  type:'info',
                  autoClose:2000
              })
              props.setIdActual('');
          }
          setObjeto(camposRegistro);
      }catch(error){
          console.log("Error en crear o update..",error);
      }     
  };
  const validarForm = () => {
      if(objeto.nombre==="" || /^\s+$/.test(objeto.nombre)){
          alert("Escriba nombres...");
          return false;
      }

      if (objeto.edad==="" || /^\s+$/.test(objeto.edad)) {
        alert("Escriba edad...");
        return false;
    }
    if (objeto.genero==="" || /^\s+$/.test(objeto.genero)) {
      alert("Escriba género...");
      return false;
    }
      return true;
  };

  useEffect( () => {
      if(props.idActual ===""){
          setObjeto({...camposRegistro});
      }else{
          obtenerDatosPorId(props.idActual);
      }
  }, [props.idActual]);

  const obtenerDatosPorId =async(xId)=>{
      const objPorId = doc(db, "persona",xId);
      const docPorId = await getDoc(objPorId);
      if (docPorId.exists()){
          setObjeto(docPorId.data());
      }else{
          console.log("No hay doc... ");
      }  
  }
  

  return (
    <div >
        <form className="card card-body"onSubmit={controlSubmit}>
          <button className="btn btn-warning">
             Formulario (AppForm.js)
          </button>
          <div className="form-group input-group">
            <div className="input-group-text bd-light">
              <i className="material-icons">group_add</i>
            </div>
              <input type="text" className="form-control" name="nombre" placeholder="Nombres.." 
              onChange={controlarEstadoCambio} value={objeto.nombre}/> 
          </div>
          
          <div className="form-group input-group clearfix">
            <div className="input-group-text bd-light">
              <i className="material-icons"> star_half</i>
            </div>
              <input type="text" className="form-control" name="edad" placeholder="Edad.." 
              onChange={controlarEstadoCambio} value={objeto.edad}/> 
          </div>

          <div className="form-group input-group ">
            <div className="input-group-text bd-light">
              <i className="material-icons"> insert_link</i>
            </div>
              <input type="text" className="form-control" name="genero" placeholder="Género.." 
              onChange={controlarEstadoCambio} value={objeto.genero}/> 
          </div>
          
          <button className="btn btn-warning">
            {props.idActual === ""? "Guardar" : "Actualizar"}
          </button>

        </form>
    </div>
  )
}

export default AppForm