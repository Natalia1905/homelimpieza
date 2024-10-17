import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/producto';
const CATEGORIAS_URL = 'https://api-iv1i.onrender.com/categoria';

const Typography = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    producto_id: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error al cargar los productos. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORIAS_URL);
      const activeCategories = response.data.filter(category => category.status === 'A');
      setCategories(activeCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Error al cargar las categorías. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        producto_id: editingProduct.producto_id,
        usuario_mod: '',
      });
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: '',
      producto_id: '',
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
      if (editingProduct) {
        await axios.put(`${API_URL}/${formData.producto_id}`, formData);
        setSuccessMessage('Producto actualizado exitosamente!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Producto guardado exitosamente!');
      }
      fetchProducts();
      setEditingProduct(null);
      resetForm();
      setFormVisible(false);
    } catch (error) {
      setErrorMessage('Error guardando el producto. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'A' ? 'I' : 'A';
    try {
      await axios.patch(`${API_URL}/${id}`, { status: newStatus });
      fetchProducts();
      setSuccessMessage('Estado actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage('Error al actualizar el estado. Inténtalo de nuevo.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
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
        GESTIÓN DE PRODUCTOS
      </h2>

      <li className="LinksGroup_headerLink__3fPmk">
        <button
          className="LinksGroup_accordionToggle__20prd btn btn-warning"
          onClick={() => setFormVisible(!formVisible)}
          style={{ padding: '10px', width: '100%' }}
        >
          Formulario de Producto   
          <b className={`fa fa-angle-${formVisible ? 'down' : 'right'} LinksGroup_caret__25oSl`}></b>
        </button>
        {formVisible && (
          <div className="LinksGroup_panel__1W7_K collapse show">
            <form onSubmit={handleSubmit} className="widget-body">
              <legend><strong>Detalles del Producto</strong></legend>
              <Table>
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
                    <td><label htmlFor="precio">Precio ($)</label></td>
                    <td>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          id="precio"
                          name="precio"
                          value={formData.precio}
                          onChange={handleChange}
                          placeholder="Precio del producto"
                          type="number"
                          className="form-control-16 form-control"
                          required
                        />
                        <span className="input-group-text">.00</span>
                      </div>
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
                        <option value="" disabled>Selecciona una categoría</option>
                        {categories.map((category) => (
                          <option key={category.categoria_id} value={category.categoria_id}>
                            {category.nombre_categoria}
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
                  {editingProduct && (
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
                    {editingProduct ? 'Actualizar' : 'Agregar'}
                  </button>
                  {editingProduct && (
                    <button type="button" className="btn btn-default" onClick={() => setEditingProduct(null)}>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </li>

      {successMessage && (
        <div className="alert alert-success fade show" role="alert" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger fade show" role="alert" style={{ position: 'absolute', top: '70px', right: '20px', zIndex: 1000 }}>
          {errorMessage}
        </div>
      )}

      <Widget
        title={<h5>Productos <span className="fw-semi-bold">Limpieza</span></h5>}
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0">
          <thead className="text-uppercase">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.producto_id}>
                <td>{product.nombre}</td>
                <td>{product.descripcion}</td>
                <td>${product.precio}</td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  {product.status === 'A' ? (
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
                    onClick={() => handleEdit(product)}
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

export default Typography;
