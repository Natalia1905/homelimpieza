import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/categoria_superficie_producto';

const CategoriaSuperficie = () => {
  const [superficies, setSuperficies] = useState([]);
  const [editingSuperficie, setEditingSuperficie] = useState(null);
  const [formData, setFormData] = useState({
    superficie_nombre: '',
    superficie_descripcion: '',
    categoria_superficie_producto_id: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSuperficies();
  }, []);

  const fetchSuperficies = async () => {
    try {
      const response = await axios.get(API_URL);
      setSuperficies(response.data);
    } catch (error) {
      console.error('Error fetching superficies:', error);
      setErrorMessage('Error al cargar las superficies. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingSuperficie) {
      setFormData({
        ...editingSuperficie,
        categoria_superficie_producto_id: editingSuperficie.categoria_superficie_producto_id,
        usuario_mod: '',
      });
    } else {
      resetForm();
    }
  }, [editingSuperficie]);

  const resetForm = () => {
    setFormData({
      superficie_nombre: '',
      superficie_descripcion: '',
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
      if (editingSuperficie) {
        await axios.put(`${API_URL}/${formData.categoria_superficie_producto_id}`, formData);
        setSuccessMessage('Superficie actualizada exitosamente!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Superficie guardada exitosamente!');
      }
      fetchSuperficies();
      setEditingSuperficie(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando la superficie. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (superficie) => {
    setEditingSuperficie(superficie);
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
        GESTIÓN DE CATEGORÍAS DE ÁREAS
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Áreas</strong></legend>
        <Table responsive>
          <tbody>
            <tr>
              <td><label htmlFor="superficie_nombre">Nombre</label></td>
              <td>
                <input
                  id="superficie_nombre"
                  name="superficie_nombre"
                  value={formData.superficie_nombre}
                  onChange={handleChange}
                  placeholder="Nombre del área"
                  type="text"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="superficie_descripcion">Descripción</label></td>
              <td>
                <input
                  id="superficie_descripcion"
                  name="superficie_descripcion"
                  value={formData.superficie_descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del área"
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
            {editingSuperficie && (
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
              {editingSuperficie ? 'Actualizar' : 'Agregar'}
            </button>
            {editingSuperficie && (
              <button type="button" className="btn btn-default" onClick={() => setEditingSuperficie(null)}>
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
            Categorías del Área <span className="fw-semi-bold">Limpieza</span>
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
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {superficies.map((superficie) => (
              <tr key={superficie.categoria_superficie_producto_id}>
                <td>{superficie.superficie_nombre}</td>
                <td>{superficie.superficie_descripcion}</td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  {superficie.status === 'A' ? (
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
                    onClick={() => handleEdit(superficie)}
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

export default CategoriaSuperficie;
