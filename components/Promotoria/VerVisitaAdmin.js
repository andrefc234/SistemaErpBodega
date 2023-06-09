import React,{useState,useEffect,useRef} from 'react'
import Navb from '../Navb'
import {Container,ListGroup,Row,Col,Modal,Button,Form,Table,Stack,Tab,Accordion} from 'react-bootstrap'
import lodash from 'lodash'
import Pdf from '../TestComponents/Pdf'
import ReactPDF from 'react-to-pdf'
import axios from 'axios'
import Image from 'next/image'
import Router from 'next/router'

export default function VerVisitaAdmin({user})  {
  const initialState = {
  productos:[{}]
  }
  const [dta, setdta] = useState([initialState])
  const [pta, setpta] = useState([])

  const fetchdta = async (d) => {
    var result = [];
    const resp = await fetch(`http://${process.env.IP}:5000/api/v1/promotor/visita/${d}`)
    const dtajson = await resp.json()
    const crdta = dtajson.data
     return setdta(crdta);  
      
  }
  const fetchptda = async (d) => {
    var result = [];
    const resp = await fetch(`http://${process.env.IP}:5000/api/v1/productos`)
    const dtajson = await resp.json()
    const crdta = dtajson.data
    return setpta(crdta); 
  }

  useEffect(() => {
    fetchptda()
  
  
  }, [])
  
  const handlesbmt = async (e) => {
    e.preventDefault()  
    var fechaRemision=  document.getElementById(`fechaRemision`).value
    fetchdta(fechaRemision)
    
  }
  const updVisita = async (e) => {
   let est =  document.getElementById(`estatus`).value
  
   const data = {
    estatus:est

    }
   const resp = await axios.put(`http://${process.env.IP}:5000/api/v1/promotor/update/${e}`,data)





  }
  return(<>
  <Form onSubmit={handlesbmt} >
  <Form.Group className="mb-3">
     <Form.Label >Fecha</Form.Label>
     <Form.Control type="date" placeholder="Fecha" id='fechaRemision'/>
     <Form.Text className="text-muted">
         Fecha Liquidacion
       </Form.Text>
   </Form.Group>
  
 <div><Table striped bordered hover responsive><thead>
    <tr>
      <th>Folio</th>
      <th> Nombre Tienda</th>
      <th>TDA</th>
      <th>Vendedor</th>
      <th>Fecha </th>
      <th>Existencia</th>
      <th>Altas </th>
      <th>Bajas </th>
      

      
      
      {pta.map(p => {
          return(<><th className= 'bg-info' >Existencia {p.nombre}</th>
           <th className= 'bg-danger' key='-'>Bajas {p.nombre}</th> 
           <th className= 'bg-success ' key='-'>Altas {p.nombre}</th></>)})}
           <th>Rotacion </th>
           <th>Estatus </th>
           <th>Imagen</th>

    </tr>
  </thead>
  <tbody>
    {dta.map(d => {
      const date = new Date(d.fecha)
        return(
      
      
        <tr key='-'>
          <td key='-' name='folio'>{d.folio}</td>
          <td key='-' name='nombreTienda'>{d.nombreTienda}</td>
          <td key='-' name='TDA'>{d.TDA}</td>
          <td key='-' name='promotor'>{d.promotor}</td>
          <td key='-' name='fecha'>{date.toLocaleDateString('es-mx')}</td>
          <td key='-' name='totalP'>{d.totalP}</td>
          <td key='-' name='altasG'>{d.altasG}</td>
          <td key='-' name='bajasG'>{d.bajasG}</td>         
          {d.productos.map(p => {
              return(<>
                <td key='-' name='existencia'>{p.existencia}</td>
                <th key='-' name='bajas'>{p.bajas}</th>
                <th key='-' name='alta'>{p.alta}</th>
                </>)
            })}
            <td>{d.rotacion}</td>
        <td>
        
          <Form >
            {d.estatus ==='liberado' && (<Form.Group className="mb-3">       
        <Form.Control disabled value={d.estatus} id='estatus' >
         
        </Form.Control>
        </Form.Group>)}
        {!d.estatus || d.estatus === 'pendiente' && (<Form.Group className="mb-3">       
        <Form.Select id='estatus' onChange={() => updVisita(d._id)}>
          <option key='-'>pendiente</option>
          <option key='-'>liberado</option> 
        </Form.Select>
        </Form.Group>)}
        </Form>
        </td>
        <td><a href={d.img} download> Descargar</a></td>
        </tr> 
    )
  })}
    </tbody>
    </Table>
    </div>
    <Button variant="primary" type="submit">
   Submit
 </Button>
   </Form>  
  </>)
}