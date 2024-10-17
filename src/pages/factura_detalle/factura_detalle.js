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
    subtotal: 0,
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
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setErrorMessage('Error al cargar los productos. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchFacturas = async () => {
    try {
      const response = await axios.get(FACTURA_URL);
      setFacturas(response.data);
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
      subtotal: 0,
      status: 'A',
      usuario_mod: '',
    });
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'cantidad' || name === 'producto_id') {
      const producto = productos.find(p => p.producto_id === formData.producto_id) || {};
      const precio = producto.precio || 0;
      const cantidad = parseInt(formData.cantidad) || 0;
      const subtotal = precio * cantidad;

      setFormData(prevData => ({
        ...prevData,
        subtotal,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (editingFacturaDetalle) {
        await axios.put(`${API_URL}/${formData.factura_detalle_id}`, formData);
        setSuccessMessage('Detalle de factura actualizado exitosamente!');
      } else {
        await axios.post(API_URL, formData);
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

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'A' ? 'I' : 'A';
    try {
      await axios.patch(`${API_URL}/${id}`, { status: newStatus });
      fetchFacturaDetalles();
      setSuccessMessage('Estado actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage('Error al actualizar el estado. Inténtalo de nuevo.');
    }
  };

  const handleEdit = (facturaDetalle) => {
    setEditingFacturaDetalle(facturaDetalle);
  };

  const getFacturaTotales = () => {
    const totals = {};
    
    facturaDetalles.forEach(detalle => {
      const facturaId = detalle.factura_id;
      const subtotal = detalle.total || detalle.subtotal; // Asegúrate de que 'total' está presente

      if (!totals[facturaId]) {
        const factura = facturas.find(f => f.factura_id === facturaId);
        totals[facturaId] = {
          total: 0,
          cliente: factura ? factura.cliente : 'Desconocido',
        };
      }
      
      totals[facturaId].total += subtotal; // Suma el subtotal al total existente
    });

    return Object.keys(totals).map(facturaId => ({
      facturaId,
      total: totals[facturaId].total,
      cliente: totals[facturaId].cliente,
    }));
  };

  const facturaTotales = getFacturaTotales();

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
    <div>
      <h2 style={{
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        margin: '20px 0'
      }}>
        GESTIÓN DE DETALLES DE FACTURA
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Detalle de Factura</strong></legend>
        <Table>
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
                  {facturas
                    .filter(factura => factura.status === 'A')
                    .map((factura) => (
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
                  {productos
                    .filter(producto => producto.status === 'A')
                    .map((producto) => (
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
            <button type="submit" className="me-4 btn btn-primary">
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
        <Table className="table-bordered table-lg mt-lg mb-0">
          <thead className="text-uppercase">
            <tr>
              <th>Factura</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturaDetalles.map((detalle) => {
              const factura = facturas.find(f => f.factura_id === detalle.factura_id);
              const producto = productos.find(p => p.producto_id === detalle.producto_id);
              return (
                <tr key={detalle.factura_detalle_id}>
                  <td>{factura ? `${factura.cliente} - ${factura.factura_id}` : detalle.factura_id}</td>
                  <td>{producto ? producto.nombre : detalle.producto_id}</td>
                  <td>{detalle.cantidad}</td>
                  <td>${detalle.subtotal}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    {detalle.status === 'A' ? (
                      <span className="px-2 btn btn-success btn-xs" style={{ flex: 1 }}>
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 btn btn-danger btn-xs" style={{ flex: 1 }}>
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs w-100"
                      onClick={() => handleEdit(detalle)}
                    >
                      <span className="d-none d-md-inline-block">Editar</span>
                      <span className="d-md-none"><i className="la la-edit"></i></span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Widget>

      {/* Nueva tabla para mostrar FACTURA y TOTAL */}
      <Widget
        title={
          <h5>
            Totales de Factura
          </h5>
        }
      >
        <Table className="table-bordered table-lg mt-lg mb-0">
          <thead className="text-uppercase">
            <tr>
              <th>Factura</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {facturaTotales.map(({ facturaId, total, cliente }) => (
              <tr key={facturaId}>
                <td>{`${cliente} - ${facturaId}`}</td>
                <td>${typeof total === 'number' ? total.toFixed(2) : '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Widget>
    </div>
  );
};

export default FacturaDetalle;
