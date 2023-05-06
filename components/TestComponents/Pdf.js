import Image from 'next/image'
import React,{useState} from 'react'
import {Container, Row,Col,Table} from 'react-bootstrap'

export default function Pdf(props) {
    const [subtotal, setsubtotal] = useState(null)
    var iva =props.subtotal*0.16
    var stotal =props.subtotal
    var total = parseFloat(iva) + parseFloat(stotal)
  return (
 <>
 <Container>
     <Row>
         <Col>
         <h1 className='text-dark'>Remision</h1>
         <p className='text-dark'>{props.numero}</p>
         <p className='text-dark'>{props.fecha}</p>
         </Col>
         <Col>
         <Image
         src='/torologo.webp'
         width={200}
         height={100}
         alt=''        
         />
         </Col>
     </Row>
     <br/>
     <Row>
         <Col>
         <h1 className='text-dark'>Emisor</h1>
         <strong className='text-dark'>Jorge Daniel Torales Rodriguez</strong>
         <p className='text-dark'>Av. Tratoli 92B</p>
         <p className='text-dark'>Santuarios</p>
         <p className='text-dark'>Corregidora,Qro,76900</p>
         <p className='text-dark'>RFC: TORJ830122GD4</p>
         </Col>
         <Col>
         <h1 className='text-dark'>Cliente</h1>
         <strong className='text-dark'>{props.cliente}</strong>
         <p className='text-dark'>RFC: {props.rfc}</p>
         </Col>
     </Row>
     <Row>        
         <Table  bordered hover >
         <Col>
      <thead>
        <tr>
          <th className='text-dark'>Clave</th>
          <th className='text-dark'>Cant.</th>
          <th className='text-dark'>Descripcion</th>
          <th className='text-dark'>P.Unitario</th>
          <th className='text-dark'>Importe</th>
        </tr>
      </thead>
      <tbody>   
        {props.productos.map(p => (
            <>
            <tr>
          <td className='text-dark'>{p.codigoBarras}</td>
          <td className='text-dark'>{p.cantidad}</td>
          <td className='text-dark'>{p.nombreProducto}</td>
          <td className='text-dark'>${p.precioUnitario}</td>
          <td className='text-dark'>${p.importe}</td> 
        </tr>
            </>
        ))} 
      </tbody>
      </Col>
      <Col> <tfoot>
                        <tr>
                            <th colSpan="3" className="text-right ">subtotal</th>
                            <td className='text-dark'> ${props.subtotal}</td>
                        </tr>
                    
                        
                        <tr>
                            <th colSpan="3" className="text-right">Impuestos</th>
                            <td className='text-dark'> ${props.subtotal*0.16}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" className="text-right">
                                <h4 className='text-dark'>Total</h4>
                            </td>
                            <td>
                                <h4 className='text-dark'> ${total}</h4>
                            </td>
                        </tr>
                    </tfoot></Col>
      </Table>    
     </Row>
 </Container>         
 </>
  )
}