
import React,{useState,useEffect,useRef} from 'react'
import Navb from '../Navb'
import {Container,ListGroup,Row,Col,Modal,Button,Form,Table,Stack,Tab,Accordion} from 'react-bootstrap'
import lodash from 'lodash'
import Pdf from '../TestComponents/Pdf'
import ReactPDF from '../TestComponents/ReactToPdf'
import axios from 'axios'
import Image from 'next/image'
import Router from 'next/router'


export default function VerPedidos({user})  {
    const initialState = {
  
      productos:[],
      fecha:[]
    }
    const [dta, setdta] = useState([initialState])
    const [pta, setpta] = useState([])
    
    
    const fetchdtaH= async () => {
      var result = [];
      const resp = await fetch(`/api/almacen/pedido/`)
      const dtajson = await resp.json()
      const crdta = dtajson.data
       
       console.log(crdta)
        return setdta(crdta); 
       
       
      }
    const fetchptda = async (d) => {
      var result = [];
    const resp = await fetch(`/api/productos`)
     const dtajson = await resp.json()
     const crdta = dtajson.data
     
     
      return setpta(crdta); 
     
     
    }
    const handlesbmt = async (e) => {
      e.preventDefault()  
      var fechaRemision=  document.getElementById(`fechaRemision`).value
      var monthdate = new Date(fechaRemision)
      console.log(monthdate.getMonth())
      fetchdta(fechaRemision)
      fetchptda()
      
      
     
     
     
    
    }
    const handlesubmt = async (e) => {
      e.preventDefault()  
    
      fetchdtaH()
      fetchptda()
      
      
     
     
     
    
    }
    const [submitted, setSubmitted] = useState(false);
  
  
  
    useEffect(() => {
      fetchptda()
      fetchdtaH()
      getuser()
      if (submitted) {
        alert('Informacion Agregada');
        setSubmitted(false);
      }
     
    }, [submitted])
    const [users, setusers] = useState([])
    const getuser = async () => {
      const res = await fetch(`/api/auth/users`)
      const dta = await res.json()
      const crdta = dta.data
      var vendedores = []
      crdta.map(e => {
        if(e.role === 'vendedor'){
          vendedores.push(e.nombre)
        }
      })
     return setusers(vendedores)
    }
    const [activeEditar, setactiveEditar] = useState(false)
    const handlePicking = async  (d) => {
    
    var tda
    var fech
    var empleado
    var prod
    
    tda = d.TDA
    fech = document.getElementById(`fechaE${d.TDA}`).value
    empleado = d.empleado
    prod = d.productos
   
    if(activeEditar){
      fech = document.getElementById(`fechaE${d.TDA}`).value
      empleado = document.getElementById(`usuario${d.TDA}`).value
    }
   
    const data = {
      TDA:tda,
      fecha:days.indexOf(fech),
      empleadoEntrega:empleado,
      productos:prod,
      estatus:'pendiente',
      idPedido:d.id
      
      
    }
    console.log(data.fecha)
    const update = {
      estatus:'liberado'
    }
    const respPicking = await axios.post(`/api/picking/crear`,data)
    const updatePedido = await axios.put(`/api/almacen/pedido/update/${d.id}`,update)
  console.log(updatePedido)
  setSubmitted(true);
  
    }
    const days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
  const handleEliminar = async (id) => {

const resp = await axios.delete(`/api/almacen/pedido/delete/${id}`)
console.log(resp)
  }
    return(<>
    <Form  >
    
   <div><Table striped bordered hover responsive><thead>
      <tr>
        
        
        <th>TDA</th>
  
        <th>Total</th>
        <th>Dias para entregar en tienda </th>
        
        {pta.map(p => {
          return(<th key='-'>{p.nombre}</th>)
        })}
        <th>Empleado encargado entrega</th>
        <th>Estatus</th>
        <th>Fecha Promotoria</th>
        <th>Editar Encargado Entrega</th>
        <th>Agregar a Picking List</th>
        <th>Eliminar</th>
      </tr>
    </thead>
    <tbody>
      {dta.map(d => {
          return(
        
        
        
            <>
            <>
          <tr>
            
            
            <td key='-' id={d.TDA}>{d.TDA}</td>
  
            <td key='-' id={`total${d.TDA}`}>{d.totalPedido}</td>
            <td><Form.Select id={`fechaE${d.TDA}`}>
              <option>-</option>
              {(d.fecha || []).map((f)=> {
                return(
                <option>{days[f.dia]}</option>)
              })}
              </Form.Select></td>
            {d.productos.map(p => {
              return(
                <td key='-' className='text-dark'>{p.cantidad}</td>
                )
            })}
            <td>{(activeEditar) ?
             <>
             <Form.Select id={`usuario${d.TDA}`}>
             {users.map(u => {
               return(<>
                <option>{u}</option>
               </>)
             })}
             </Form.Select>
  
             </>
            :<td>{d.empleado}</td>}</td>
            <td>{d.estatus}</td>
            <td>{d.fechaPromotoria}</td>
              <td>{activeEditar ? <Button onClick={() => setactiveEditar(false) } >regresar</Button>:<Button onClick={() => setactiveEditar(true)} >editar empleado</Button>}</td>
              <td><Button onClick={() => handlePicking(d)}>Crear picking</Button></td>
              <td><Button onClick={()=>handleEliminar(d.id)}>Eliminar </Button></td>
          </tr>
             
          
  
          </>
            </>
        
      )
    })}
      </tbody>
      
      </Table>
      </div>
  
     </Form>
     
    </>)
  }