import Widget from '../../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const CATEGORIAS_URL = 'https://api-iv1i.onrender.com/categoria';

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: '',
    fecha_creac: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORIAS_URL);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Error al cargar las categorías. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        ...editingCategory,
      });
    } else {
      resetForm();
    }
  }, [editingCategory]);

  const resetForm = () => {
    setFormData({
      nombre_categoria: '',
      descripcion: '',
      fecha_creac: '',
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
      if (editingCategory) {
        await axios.put(`${CATEGORIAS_URL}/${formData.categoria_id}`, formData);
        setSuccessMessage('Categoría actualizada exitosamente!');
      } else {
        await axios.post(CATEGORIAS_URL, formData);
        setSuccessMessage('Categoría guardada exitosamente!');
      }
      fetchCategories();
      setEditingCategory(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando la categoría. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  return (
    <div className="container">
      <h2 className="text-center font-weight-bold my-4">GESTIÓN DE CATEGORÍAS</h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Categoría</strong></legend>
        <Table responsive>
          <tbody>
            <tr>
              <td><label htmlFor="nombre_categoria">Nombre</label></td>
              <td>
                <input
                  id="nombre_categoria"
                  name="nombre_categoria"
                  value={formData.nombre_categoria}
                  onChange={handleChange}
                  placeholder="Nombre de la categoría"
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
                  placeholder="Descripción de la categoría"
                  type="text"
                  className="form-control"
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
            {editingCategory && (
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
              {editingCategory ? 'Actualizar' : 'Agregar'}
            </button>
            {editingCategory && (
              <button type="button" className="btn btn-default" onClick={() => setEditingCategory(null)}>
                Cancelar
              </button>
            )}
          </div>
        </div>

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
      </form>

      <Widget
        title={<h5>Categorías</h5>}
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0" responsive>
          <thead className="text-uppercase">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoria_id}>
                <td>{category.nombre_categoria}</td>
                <td>{category.descripcion}</td>
                <td style={{ textAlign: 'center' }}>
                  {category.status === 'A' ? (
                    <span className="px-2 btn btn-success btn-xs" style={{ display: 'block', width: '100%' }}>
                      Activo
                    </span>
                  ) : (
                    <span className="px-2 btn btn-danger btn-xs" style={{ display: 'block', width: '100%' }}>
                      Inactivo
                    </span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-xs w-100"
                    onClick={() => handleEdit(category)}
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

export default Categorias;
