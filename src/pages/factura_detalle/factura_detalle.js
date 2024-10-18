import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/factura_detalle';
const PRODUCTO_URL = 'https://api-iv1i.onrender.com/producto';
const FACTURA_URL = 'https://api-iv1i.onrender.com/facturacion';

const FacturaDetalle = () => {
  const [facturaDetalles, setFacturaDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [editingFacturaDetalle, setEditingFacturaDetalle] = useState(null);
  const [formData, setFormData] = useState({
    factura_id: '',
    producto_id: '',
    cantidad: '',
    subtotal: 1, // Set default subtotal to 1
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchFacturaDetalles();
    fetchProductos();
    fetchFacturas();
  }, []);

  const fetchFacturaDetalles = async () => {
    try {
      const response = await axios.get(API_URL);
      setFacturaDetalles(response.data);
    } catch (error) {
      console.error('Error fetching factura detalles:', error);
      setErrorMessage('Error al cargar los detalles de la factura. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get(PRODUCTO_URL);
      const productosActivos = response.data.filter(producto => producto.status === 'A');
      setProductos(productosActivos);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setErrorMessage('Error al cargar los productos. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchFacturas = async () => {
    try {
      const response = await axios.get(FACTURA_URL);
      const facturasActivas = response.data.filter(factura => factura.status === 'A');
      setFacturas(facturasActivas);
    } catch (error) {
      console.error('Error fetching facturas:', error);
      setErrorMessage('Error al cargar las facturas. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingFacturaDetalle) {
      setFormData({
        ...editingFacturaDetalle,
        usuario_mod: '',
      });
    } else {
      resetForm();
    }
  }, [editingFacturaDetalle]);

  const resetForm = () => {
    setFormData({
      factura_id: '',
      producto_id: '',
      cantidad: '',
      subtotal: 1, // Reset subtotal to 1
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
    try {
      if (editingFacturaDetalle) {
        await axios.put(`${API_URL}/${formData.factura_detalle_id}`, formData);
        setSuccessMessage('Detalle de factura actualizado exitosamente!');
      } else {
        // Add subtotal to formData before submission
        const newFormData = { ...formData, subtotal: 1 };
        await axios.post(API_URL, newFormData);
        setSuccessMessage('Detalle de factura guardado exitosamente!');
      }
      fetchFacturaDetalles();
      setEditingFacturaDetalle(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando el detalle de factura. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (facturaDetalle) => {
    setEditingFacturaDetalle(facturaDetalle);
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
        GESTIÓN DE DETALLES DE FACTURA
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Detalle de Factura</strong></legend>
        <Table responsive>
          <tbody>
            <tr>
              <td><label htmlFor="factura_id">Factura</label></td>
              <td>
                <select
                  id="factura_id"
                  name="factura_id"
                  value={formData.factura_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="" disabled>Selecciona una factura</option>
                  {facturas.map((factura) => (
                    <option key={factura.factura_id} value={factura.factura_id}>
                      {factura.cliente} - {factura.factura_id}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="producto_id">Producto</label></td>
              <td>
                <select
                  id="producto_id"
                  name="producto_id"
                  value={formData.producto_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="" disabled>Selecciona un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.producto_id} value={producto.producto_id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="cantidad">Cantidad</label></td>
              <td>
                <input
                  id="cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  placeholder="Cantidad"
                  type="number"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            {/* Removed the subtotal input */}
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
            {editingFacturaDetalle && (
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
              {editingFacturaDetalle ? 'Actualizar' : 'Agregar'}
            </button>
            {editingFacturaDetalle && (
              <button type="button" className="btn btn-default" onClick={() => setEditingFacturaDetalle(null)}>
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
            Detalles de Factura <span className="fw-semi-bold">Limpieza</span>
          </h5>
        }
        settings
        close
      >
       <Table className="table-bordered table-lg mt-lg mb-0" responsive>
  <thead className="text-uppercase">
    <tr>
      <th>Factura</th>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Subtotal</th>
      <th>Status</th>
      <th>Acciones</th>
    </tr>
  </thead><tbody>
  {facturaDetalles.map((detalle) => {
    // Busca la factura correspondiente para obtener el cliente
    const producto = productos.find(p => p.producto_id === detalle.producto_id);
    const factura = facturas.find(f => f.factura_id === detalle.factura_id);
    const clienteNombre = factura ? factura.cliente : 'Cliente no encontrado'; // Manejo de error

    return (
      <tr key={detalle.factura_detalle_id}>
        <td>{detalle.factura_id} - {clienteNombre}</td> {/* Agregado aquí */}
        <td>{producto ? producto.nombre : 'Producto no encontrado'}</td> {/* Show product name */}
        <td>{detalle.cantidad}</td>
        <td>${detalle.subtotal}</td>
        <td className="text-center">
          {detalle.status === 'A' ? (
            <span className="px-2 btn btn-success btn-xs w-100">Activo</span>
          ) : (
            <span className="px-2 btn btn-danger btn-xs w-100">Inactivo</span>
          )}
        </td>
        <td>
          <button className="btn btn-primary btn-xs w-100" onClick={() => handleEdit(detalle)}>
            Editar
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

</Table>

      </Widget>
    </div>
  );
};

export default FacturaDetalle;
