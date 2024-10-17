import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/compra_producto';
const PROVEEDORES_URL = 'https://api-iv1i.onrender.com/proveedor';
const PRODUCTOS_URL = 'https://api-iv1i.onrender.com/producto';

const CompraProducto = () => {
  const [compras, setCompras] = useState([]);
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [editingCompra, setEditingCompra] = useState(null);
  const [formData, setFormData] = useState({
    proveedor_id: '',
    producto_id: '',
    fecha: '',
    monto: '',
    descripcion: '',
    compra_producto_id: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
    fetchProductos();
  }, []);

  const fetchCompras = async () => {
    try {
      const response = await axios.get(API_URL);
      setCompras(response.data);
      setFilteredCompras(response.data); // Inicialmente, muestra todas las compras
    } catch (error) {
      console.error('Error fetching compras:', error);
      setErrorMessage('Error al cargar las compras. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get(PROVEEDORES_URL);
      const activos = response.data.filter(proveedor => proveedor.status === 'A');
      setProveedores(activos);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
      setErrorMessage('Error al cargar los proveedores. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await axios.get(PRODUCTOS_URL);
      const activos = response.data.filter(producto => producto.status === 'A');
      setProductos(activos);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setErrorMessage('Error al cargar los productos. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingCompra) {
      setFormData({
        proveedor_id: editingCompra.proveedor_id,
        producto_id: editingCompra.producto_id,
        fecha: new Date(editingCompra.fecha).toISOString().split('T')[0], // Formato YYYY-MM-DD
        monto: editingCompra.monto,
        descripcion: editingCompra.descripcion,
        compra_producto_id: editingCompra.compra_producto_id,
        status: editingCompra.status,
        usuario_mod: '',
      });
    } else {
      resetForm();
    }
  }, [editingCompra]);

  const resetForm = () => {
    setFormData({
      proveedor_id: '',
      producto_id: '',
      fecha: '',
      monto: '',
      descripcion: '',
      compra_producto_id: '',
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
      if (editingCompra) {
        await axios.put(`${API_URL}/${formData.compra_producto_id}`, formData);
        setSuccessMessage('Compra actualizada exitosamente!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Compra guardada exitosamente!');
      }
      fetchCompras();
      setEditingCompra(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando la compra. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (compra) => {
    setEditingCompra(compra);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filterByMonth = () => {
    if (selectedMonth) {
      const filtered = compras.filter(compra => {
        const compraDate = new Date(compra.fecha);
        return compraDate.getMonth() + 1 === parseInt(selectedMonth); // +1 porque getMonth() es 0-indexado
      });
      setFilteredCompras(filtered);
    } else {
      setFilteredCompras(compras);
    }
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
    <div>
      <h2 style={{
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
        margin: '20px 0'
      }}>
        GESTIÓN DE COMPRAS
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Compra</strong></legend>
        <Table>
          <tbody>
            <tr>
              <td><label htmlFor="proveedor_id">Proveedor</label></td>
              <td>
                <select
                  id="proveedor_id"
                  name="proveedor_id"
                  value={formData.proveedor_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="" disabled>Selecciona un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.proveedor_id} value={proveedor.proveedor_id}>
                      {proveedor.nombre_proveedor}
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
              <td><label htmlFor="fecha">Fecha</label></td>
              <td>
                <input
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  type="date"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="monto">Monto ($)</label></td>
              <td>
                <input
                  id="monto"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  placeholder="Monto de la compra"
                  type="number"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="descripcion">Descripción</label></td>
              <td>
                <input
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción de la compra"
                  type="text"
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
            {editingCompra && (
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
              {editingCompra ? 'Actualizar' : 'Agregar'}
            </button>
            {editingCompra && (
              <button type="button" className="btn btn-default" onClick={() => setEditingCompra(null)}>
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

      <div style={{ margin: '20px 0' }}>
        <label htmlFor="month">Filtrar por mes:</label>
        <select id="month" value={selectedMonth} onChange={handleMonthChange} className="form-control" style={{ width: '200px', display: 'inline-block', marginLeft: '10px' }}>
          <option value="">Selecciona un mes</option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <button onClick={filterByMonth} className="btn btn-primary" style={{ marginLeft: '10px' }}>Filtrar</button>
      </div>

      <Widget
        title={
          <h5>
            Compras <span className="fw-semi-bold">Realizadas</span>
          </h5>
        }
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0">
          <thead className="text-uppercase">
            <tr>
              <th>Proveedor</th>
              <th>Producto</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompras.map((compra) => {
              const proveedor = proveedores.find(p => p.proveedor_id === compra.proveedor_id);
              const producto = productos.find(p => p.producto_id === compra.producto_id);

              return (
                <tr key={compra.compra_producto_id}>
                  <td>{proveedor ? proveedor.nombre_proveedor : 'Proveedor no encontrado'}</td>
                  <td>{producto ? producto.nombre : 'Producto no encontrado'}</td>
                  <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                  <td>${compra.monto}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    {compra.status === 'A' ? (
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
                      onClick={() => handleEdit(compra)}
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
    </div>
  );
};

export default CompraProducto;
