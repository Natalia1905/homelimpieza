import Widget from '../../components/Widget';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/proveedor';

const ProveedorManagement = () => {
  const [proveedores, setProveedores] = useState([]);
  const [editingProveedor, setEditingProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre_proveedor: '',
    nombre_contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get(API_URL);
      setProveedores(response.data);
    } catch (error) {
      console.error('Error fetching proveedores:', error);
      setErrorMessage('Error al cargar los proveedores. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingProveedor) {
      setFormData({
        ...editingProveedor,
        usuario_mod: '',
      });
    } else {
      resetForm();
    }
  }, [editingProveedor]);

  const resetForm = () => {
    setFormData({
      nombre_proveedor: '',
      nombre_contacto: '',
      telefono: '',
      correo: '',
      direccion: '',
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
      if (editingProveedor) {
        await axios.put(`${API_URL}/${formData.proveedor_id}`, formData);
        setSuccessMessage('Proveedor actualizado exitosamente!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Proveedor guardado exitosamente!');
      }
      fetchProveedores();
      setEditingProveedor(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando el proveedor. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'A' ? 'I' : 'A';
    try {
      await axios.patch(`${API_URL}/${id}`, { status: newStatus });
      fetchProveedores();
      setSuccessMessage('Estado actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating status:', error);
      setErrorMessage('Error al actualizar el estado. Inténtalo de nuevo.');
    }
  };

  const handleEdit = (proveedor) => {
    setEditingProveedor(proveedor);
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
        GESTIÓN DE PROVEEDORES
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Proveedor</strong></legend>
        <Table>
          <tbody>
            <tr>
              <td><label htmlFor="nombre_proveedor">Nombre del Proveedor</label></td>
              <td>
                <input
                  id="nombre_proveedor"
                  name="nombre_proveedor"
                  value={formData.nombre_proveedor}
                  onChange={handleChange}
                  placeholder="Nombre del proveedor"
                  type="text"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="nombre_contacto">Nombre de Contacto</label></td>
              <td>
                <input
                  id="nombre_contacto"
                  name="nombre_contacto"
                  value={formData.nombre_contacto}
                  onChange={handleChange}
                  placeholder="Nombre de contacto"
                  type="text"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="telefono">Teléfono</label></td>
              <td>
                <input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  type="text"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="correo">Correo</label></td>
              <td>
                <input
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Correo"
                  type="email"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="direccion">Dirección</label></td>
              <td>
                <input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Dirección"
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
            {editingProveedor && (
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
              {editingProveedor ? 'Actualizar' : 'Agregar'}
            </button>
            {editingProveedor && (
              <button type="button" className="btn btn-default" onClick={() => setEditingProveedor(null)}>
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
            Proveedores <span className="fw-semi-bold">Listados</span>
          </h5>
        }
        settings
        close
      >
        <Table className="table-bordered table-lg mt-lg mb-0">
          <thead className="text-uppercase">
            <tr>
              <th>Nombre</th>
              <th>Nombre de Contacto</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Dirección</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.proveedor_id}>
                <td>{proveedor.nombre_proveedor}</td>
                <td>{proveedor.nombre_contacto}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.correo}</td>
                <td>{proveedor.direccion}</td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  {proveedor.status === 'A' ? (
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
                    onClick={() => handleEdit(proveedor)}
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

export default ProveedorManagement;
