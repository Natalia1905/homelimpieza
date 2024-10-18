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
    fecha_creac: '',
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
        producto_id: editingInventario.producto_id,
        cantidad: editingInventario.cantidad,
        fecha_creac: new Date(editingInventario.fecha_creac).toISOString().split('T')[0],
        status: editingInventario.status,
        usuario_mod: '',
        inventario_id: editingInventario.inventario_id,
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
      fecha_creac: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.producto_id || !formData.cantidad || !formData.fecha_creac) {
      setErrorMessage('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      const dataToSend = {
        cantidad: parseInt(formData.cantidad, 10),
        producto_id: formData.producto_id,
        status: formData.status,
        fecha_creac: formData.fecha_creac,
        ...(editingInventario ? { usuario_mod: formData.usuario_mod } : {}),
      };

      if (editingInventario) {
        await axios.put(`${API_URL}/${formData.inventario_id}`, dataToSend);
        setSuccessMessage('Inventario actualizado exitosamente!');
      } else {
        await axios.post(API_URL, dataToSend);
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
    <div className="container">
      <h2 className="text-center font-weight-bold my-4">
        GESTIÓN DE INVENTARIO
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Inventario</strong></legend>
        <Table responsive>
          <tbody>
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
                  {products.map((producto) => (
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
                  placeholder="cantidad"
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="fecha_creac">Fecha de Creación</label></td>
              <td>
                <input
                  id="fecha_creac"
                  name="fecha_creac"
                  value={formData.fecha_creac}
                  onChange={handleChange}
                  type="date"
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
            {editingInventario && (
  <tr>
    <td><label htmlFor="usuario_mod">Usuario que edita</label></td>
    <td>
      <select
        id="usuario_mod"
        name="usuario_mod"
        value={formData.usuario_mod}
        onChange={handleChange}
        className="form-control"
        required
      >
        <option value="">Selecciona un usuario</option>
        <option value="Natalia Martinez">Natalia Martinez</option>
        <option value="Michael Guzman">Michael Guzman</option>
        <option value="Fernando Olvera">Fernando Olvera</option>
      </select>
    </td>
  </tr>
)}
          </tbody>
        </Table>
        <div className="form-action bg-transparent ps-0 row mb-3">
          <div className="col-12">
            <button type="submit" className="me-4 btn btn-warning">
              {editingInventario ? 'Actualizar' : 'Agregar'}
            </button>
            {editingInventario && (
              <button type="button" className="btn btn-default " onClick={() => setEditingInventario(null)}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success fade show " role="alert">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger fade show" role="alert">
            {errorMessage}
          </div>
        )}
      </form>

      <Widget
        title={
          <h5>
            Inventario <span className="fw-semi-bold">Gestión Agrupada</span>
          </h5>
        }
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0" responsive>
          <thead className="text-uppercase">
            <tr>
              <th>Producto</th>
              <th>Cantidad Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {groupedInventarios.map((inventario) => {
              const producto = products.find(product => product.producto_id === inventario.producto_id);
              return (
                <tr key={inventario.producto_id}>
                  <td>{producto ? producto.nombre : 'No disponible'}</td>
                  <td>{inventario.cantidad}</td>
                  <td className="text-center">
                    {inventario.status === 'A' ? (
                      <span className="px-2 btn btn-success btn-xs w-100">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 btn btn-danger btn-xs w-100">
                        Inactivo
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Widget>

      <Widget
        title={
          <h5>
            Inventario <span className="fw-semi-bold">Gestión Detallada</span>
          </h5>
        }
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0" responsive>
          <thead className="text-uppercase">
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventarios.map((inventario) => {
              const producto = products.find(product => product.producto_id === inventario.producto_id);
              return (
                <tr key={inventario.inventario_id}>
                  <td>{producto ? producto.nombre : 'No disponible'}</td>
                  <td>{inventario.cantidad}</td>
                  <td className="text-center">
                    {inventario.status === 'A' ? (
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
                      type="button"
                      className="btn btn-primary btn-xs w-100"
                      onClick={() => handleEdit(inventario)}
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
  );
};

export default Inventario;
