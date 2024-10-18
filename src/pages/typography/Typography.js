import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/producto';
const CATEGORIA_URL = 'https://api-iv1i.onrender.com/categoria';
const CATEGORIA_SUPERFICIE_URL = 'https://api-iv1i.onrender.com/categoria_superficie_producto';

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSuperficie, setCategoriasSuperficie] = useState([]);
  const [editingProducto, setEditingProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    categoria_superficie_producto_id: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchCategoriasSuperficie();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setErrorMessage('Error al cargar los productos. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(CATEGORIA_URL);
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
      setErrorMessage('Error al cargar las categorías. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchCategoriasSuperficie = async () => {
    try {
      const response = await axios.get(CATEGORIA_SUPERFICIE_URL);
      setCategoriasSuperficie(response.data);
    } catch (error) {
      console.error('Error fetching categorias superficie:', error);
      setErrorMessage('Error al cargar las categorías de superficie. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingProducto) {
      setFormData({
        ...editingProducto,
        usuario_mod: '',
      });
    } else {
      resetForm();
    }
  }, [editingProducto]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: '',
      categoria_superficie_producto_id: '',
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
      if (editingProducto) {
        await axios.put(`${API_URL}/${formData.producto_id}`, formData);
        setSuccessMessage('Producto actualizado exitosamente!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Producto guardado exitosamente!');
      }
      fetchProductos();
      setEditingProducto(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando el producto. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (producto) => {
    setEditingProducto(producto);
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
        GESTIÓN DE PRODUCTOS
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Productos</strong></legend>
        <Table responsive>
          <tbody>
            <tr>
              <td><label htmlFor="nombre">Nombre</label></td>
              <td>
                <input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del producto"
                  type="text"
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
                  placeholder="Descripción del producto"
                  type="text"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="precio">Precio</label></td>
              <td>
                <input
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio del producto"
                  type="number"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="categoria_id">Categoría</label></td>
              <td>
                <select
                  id="categoria_id"
                  name="categoria_id"
                  value={formData.categoria_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.categoria_id} value={categoria.categoria_id}>
                      {categoria.nombre_categoria} {/* Asegúrate de que este campo sea correcto */}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td><label htmlFor="categoria_superficie_producto_id">Categoría de Superficie</label></td>
              <td>
                <select
                  id="categoria_superficie_producto_id"
                  name="categoria_superficie_producto_id"
                  value={formData.categoria_superficie_producto_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Selecciona una categoría de área</option>
                  {categoriasSuperficie.map((categoriaSuperficie) => (
                    <option key={categoriaSuperficie.categoria_superficie_producto_id} value={categoriaSuperficie.categoria_superficie_producto_id}>
                      {categoriaSuperficie.superficie_nombre}
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
            {editingProducto && (
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
          <div className="col-md-12">
            <button type="submit" className="me-4 btn btn-warning">
              {editingProducto ? 'Actualizar' : 'Agregar'}
            </button>
            {editingProducto && (
              <button type="button" className="btn btn-default" onClick={() => setEditingProducto(null)}>
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
            Productos <span className="fw-semi-bold">Registrados</span>
          </h5>
        }
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0" responsive>
          <thead className="text-uppercase">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Categoría Area</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.producto_id}>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio}</td>
                <td>{categorias.find(c => c.categoria_id === producto.categoria_id)?.nombre_categoria}</td>
                <td>{categoriasSuperficie.find(cs => cs.categoria_superficie_producto_id === producto.categoria_superficie_producto_id)?.superficie_nombre}</td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  {producto.status === 'A' ? (
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
                    onClick={() => handleEdit(producto)}
                  >
                    <span className="d-none d-md-inline-block">Editar</span>
                    <span className="d-md-none"><i className="la la-edit"></i></span>
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

export default Producto;
