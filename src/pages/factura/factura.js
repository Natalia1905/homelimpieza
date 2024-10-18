import Widget from '../../components/Widget'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/facturacion';

const Facturacion = () => {
  const [facturas, setFacturas] = useState([]);
  const [editingFactura, setEditingFactura] = useState(null);
  const [formData, setFormData] = useState({
    cliente: '',
    fecha: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const response = await axios.get(API_URL);
      setFacturas(response.data);
    } catch (error) {
      console.error('Error fetching facturas:', error);
      setErrorMessage('Error al cargar las facturas. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingFactura) {
      setFormData({
        ...editingFactura,
        usuario_mod: '', // Clear this field on edit
      });
    } else {
      resetForm();
    }
  }, [editingFactura]);

  const resetForm = () => {
    setFormData({
      cliente: '',
      fecha: '',
      status: 'A',
      usuario_mod: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
  
    const { cliente, fecha, status, usuario_mod } = formData;
  
    if (!cliente || !fecha) {
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }
  
    const dataToSubmit = {
      cliente,
      fecha: new Date(fecha).toISOString().slice(0, 19), // Sin milisegundos
      status,
      ...(editingFactura && { usuario_mod }),
    };
  
    try {
      if (editingFactura) {
        await axios.put(`${API_URL}/${editingFactura.factura_id}`, dataToSubmit);
        setSuccessMessage('Factura actualizada exitosamente!');
      } else {
        await axios.post(API_URL, dataToSubmit);
        setSuccessMessage('Factura guardada exitosamente!');
      }
      fetchFacturas();
      setEditingFactura(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando la factura. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };
  
  const handleEdit = (factura) => {
    setEditingFactura(factura);
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="container">
      <h2 className="text-center font-weight-bold my-4">
        GESTIÓN DE FACTURAS
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Factura</strong></legend>
        <Table responsive>
          <tbody>
            <tr>
              <td><label htmlFor="cliente">Cliente</label></td>
              <td>
                <input
                  id="cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  placeholder="Nombre del cliente"
                  type="text"
                  className="form-control"
                  required
                />
              </td>
            </tr>
           
            <tr>
              <td><label htmlFor="fecha">Fecha</label></td>
              <td>
                <input
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  placeholder="Fecha de la factura"
                  type="datetime-local"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="status">Estado</label></td>
              <td>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="A">Activo</option>
                  <option value="I">Inactivo</option>
                </select>
              </td>
            </tr>
            {editingFactura && (
              <tr>
                <td><label htmlFor="usuario_mod">Usuario que edita</label></td>
                <td>
                  <input
                    id="usuario_mod"
                    name="usuario_mod"
                    value={formData.usuario_mod}
                    onChange={handleChange}
                    placeholder="Nombre del usuario"
                    type="text"
                    className="form-control"
                    required
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="form-action bg-transparent ps-0 row mb-3">
          <div className="col-md-12">
            <button type="submit" className="me-4 btn btn-warning">
              {editingFactura ? 'Actualizar' : 'Agregar'}
            </button>
            {editingFactura && (
              <button type="button" className="btn btn-default" onClick={() => setEditingFactura(null)}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        {successMessage && (
          <div
            className="alert alert-success fade show"
            role="alert"
            style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}
          >
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className="alert alert-danger fade show"
            role="alert"
            style={{ position: 'absolute', top: '70px', right: '20px', zIndex: 1000 }}
          >
            {errorMessage}
          </div>
        )}
      </form>

      <Widget
        title={
          <h5>
            Facturas <span className="fw-semi-bold">Registradas</span>
          </h5>
        }
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0" responsive>
          <thead className="text-uppercase">
            <tr>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.factura_id}>
                <td>{factura.cliente}</td>
                <td>{new Date(factura.fecha).toLocaleString()}</td>
                <td className="text-center">
                  {factura.status === 'A' ? (
                    <span className="px-2 btn btn-success btn-xs w-100">
                      Activo
                    </span>
                  ) : (
                    <span className="px-2 btn btn-danger btn-xs w-100">
                      Inactivo
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-xs w-100"
                    onClick={() => handleEdit(factura)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Widget>
    </div>
  );
};

export default Facturacion;
