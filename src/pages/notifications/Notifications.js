import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/inventario';
const PRODUCTOS_URL = 'https://api-iv1i.onrender.com/producto';

const Inventario = () => {
  const [inventarios, setInventarios] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingInventario, setEditingInventario] = useState(null);
  const [formData, setFormData] = useState({
    cantidad: '',
    producto_id: '',
    inventario_id: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchInventarios();
    fetchProducts();
  }, []);

  const fetchInventarios = async () => {
    try {
      const response = await axios.get(API_URL);
      setInventarios(response.data);
    } catch (error) {
      console.error('Error fetching inventarios:', error);
      setErrorMessage('Error al cargar los inventarios. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(PRODUCTOS_URL);
      // Filtramos los productos activos
      const activeProducts = response.data.filter(product => product.status === 'A');
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error al cargar los productos. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingInventario) {
      setFormData({
        ...editingInventario,
        usuario_mod: '', // Limpiar el campo usuario_mod al editar
      });
    } else {
      resetForm();
    }
  }, [editingInventario]);

  const resetForm = () => {
    setFormData({
      cantidad: '',
      producto_id: '',
      inventario_id: '',
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
      const { cantidad, producto_id } = formData;
      const existingInventario = inventarios.find(inv => inv.producto_id === producto_id);

      if (existingInventario) {
        // Si el inventario ya existe, actualizamos la cantidad
        const newCantidad = parseInt(existingInventario.cantidad) + parseInt(cantidad);
        await axios.put(`${API_URL}/${existingInventario.inventario_id}`, {
          ...existingInventario,
          cantidad: newCantidad,
          usuario_mod: formData.usuario_mod || '',
        });
        setSuccessMessage('Cantidad actualizada exitosamente!');
      } else {
        // Si no existe, creamos un nuevo inventario
        await axios.post(API_URL, formData);
        setSuccessMessage('Inventario guardado exitosamente!');
      }

      fetchInventarios();
      setEditingInventario(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando el inventario. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (inventario) => {
    setEditingInventario(inventario);
  };

  const groupInventarios = () => {
    const grouped = {};
    inventarios.forEach((inv) => {
      if (grouped[inv.producto_id]) {
        grouped[inv.producto_id].cantidad += inv.cantidad;
      } else {
        grouped[inv.producto_id] = { ...inv };
      }
    });
    return Object.values(grouped);
  };

  const groupedInventarios = groupInventarios();

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
        GESTIÓN DE INVENTARIO
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Inventario</strong></legend>
        <Table>
          <tbody>
            <tr>
              <td><label htmlFor="cantidad">Cantidad</label></td>
              <td>
                <input
                  id="cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  placeholder="Cantidad del producto"
                  type="number"
                  className="form-control"
                  required
                />
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
                  {products.map((product) => (
                    <option key={product.producto_id} value={product.producto_id}>
                      {product.nombre}
                    </option>
                  ))}
                </select>
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
            {editingInventario && (
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
              {editingInventario ? 'Actualizar' : 'Agregar'}
            </button>
            {editingInventario && (
              <button type="button" className="btn btn-default" onClick={() => setEditingInventario(null)}>
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
            Inventario <span className="fw-semi-bold">Gestión</span>
          </h5>
        }
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0">
          <thead className="text-uppercase">
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groupedInventarios.map((inventario) => {
              const producto = products.find(product => product.producto_id === inventario.producto_id);
              return (
                <tr key={inventario.producto_id}>
                  <td>{producto ? producto.nombre : 'No disponible'}</td>
                  <td>{inventario.cantidad}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    {inventario.status === 'A' ? (
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
                      onClick={() => handleEdit(inventario)}
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

export default Inventario;
