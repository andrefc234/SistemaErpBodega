import { Modal, Button } from 'react-bootstrap'

export default function VerProductosModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      fullscreen
      className="text-white"
    >
      <Modal.Header closeButton className="bg-dark" closeVariant="white">
        <Modal.Title id="contained-modal-title-vcenter" className="text-white">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
    </Modal>
  )
}
