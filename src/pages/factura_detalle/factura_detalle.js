import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/factura_detalle';
const PRODUCTO_URL = 'https://api-iv1i.onrender.com/producto';
const FACTURA_URL = 'https://api-iv1i.onrender.com/facturacion';
const CLIENTES_URL = 'https://apilimpieza.onrender.com/clientes';  // URL de la API de clientes

const FacturaDetalle = () => {
  const [facturaDetalles, setFacturaDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);  // Estado para clientes
  const [editingFacturaDetalle, setEditingFacturaDetalle] = useState(null);
  const [formData, setFormData] = useState({
    factura_id: '',
    producto_id: '',
    cantidad: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchFacturaDetalles();
    fetchProductos();
    fetchFacturas();
    fetchClientes(); // Llamada a la API de clientes
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

  const fetchClientes = async () => {
    try {
      const response = await axios.get(CLIENTES_URL); // Llamada a la API de clientes
      setClientes(response.data);  // Guardar clientes en el estado
    } catch (error) {
      console.error('Error fetching clientes:', error);
      setErrorMessage('Error al cargar los clientes. Inténtalo de nuevo más tarde.');
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
                  {facturas.map((factura) => {
                    const cliente = clientes.find(c => c.cliente_id === factura.cliente_id);
                    const clienteNombre = cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cliente no encontrado';
                    return (
                      <option key={factura.factura_id} value={factura.factura_id}>
                        {clienteNombre} - {factura.factura_id}
                      </option>
                    );
                  })}
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
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  placeholder='Cantidad'
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
          </tbody>
        </Table>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block">
            {editingFacturaDetalle ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>

      <div className="mt-4">
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <Widget
        title={
          <h5>
            Detalles <span className="fw-semi-bold">Factura</span>
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
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturaDetalles.map((facturaDetalle) => {
              const producto = productos.find(p => p.producto_id === facturaDetalle.producto_id);
              const factura = facturas.find(f => f.factura_id === facturaDetalle.factura_id);
              return (
                <tr key={facturaDetalle.factura_detalle_id}>
                  <td>{factura ? factura.factura_id : 'Factura no encontrada'}</td>
                  <td>{producto ? producto.nombre : 'Producto no encontrado'}</td>
                  <td>{facturaDetalle.cantidad}</td>
                  <td className="text-center">
          {facturaDetalle.status === 'A' ? (
            <span className="px-2 btn btn-success btn-xs w-100">Activo</span>
          ) : (
            <span className="px-2 btn btn-danger btn-xs w-100">Inactivo</span>
          )}
        </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(facturaDetalle)}
                    >
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
    </div>
  );
};

export default FacturaDetalle;
