import Widget from '../../components/Widget'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/promocion';

const Promocion = () => {
  const [promociones, setPromociones] = useState([]);
  const [filteredPromociones, setFilteredPromociones] = useState([]);
  const [editingPromocion, setEditingPromocion] = useState(null);
  const [formData, setFormData] = useState({
    nombre_promocion: '',
    descripcion: '',
    porcentaje_descuento: '',
    fecha_inicio: '',
    fecha_fin: '',
    promocion_id: '',
    status: 'A',
    usuario_mod: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchPromociones();
  }, []);

  const fetchPromociones = async () => {
    try {
      const response = await axios.get(API_URL);
      setPromociones(response.data);
      setFilteredPromociones(response.data);
    } catch (error) {
      console.error('Error fetching promociones:', error);
      setErrorMessage('Error al cargar las promociones. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    if (editingPromocion) {
      setFormData({
        nombre_promocion: editingPromocion.nombre_promocion,
        descripcion: editingPromocion.descripcion,
        porcentaje_descuento: editingPromocion.porcentaje_descuento,
        fecha_inicio: new Date(editingPromocion.fecha_inicio).toISOString().split('T')[0],
        fecha_fin: new Date(editingPromocion.fecha_fin).toISOString().split('T')[0],
        promocion_id: editingPromocion.promocion_id,
        status: editingPromocion.status,
        usuario_mod: '',
      });
    } else {
      resetForm();
    }
  }, [editingPromocion]);

  const resetForm = () => {
    setFormData({
      nombre_promocion: '',
      descripcion: '',
      porcentaje_descuento: '',
      fecha_inicio: '',
      fecha_fin: '',
      promocion_id: '',
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
      if (editingPromocion) {
        await axios.put(`${API_URL}/${formData.promocion_id}`, formData);
        setSuccessMessage('Promoción actualizada exitosamente!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Promoción guardada exitosamente!');
      }
      fetchPromociones();
      setEditingPromocion(null);
      resetForm();
    } catch (error) {
      setErrorMessage('Error guardando la promoción. Inténtalo de nuevo.');
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = (promocion) => {
    setEditingPromocion(promocion);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filterByMonth = () => {
    if (selectedMonth) {
      const filtered = promociones.filter(promocion => {
        const fechaInicio = new Date(promocion.fecha_inicio);
        return fechaInicio.getMonth() + 1 === parseInt(selectedMonth);
      });
      setFilteredPromociones(filtered);
    } else {
      setFilteredPromociones(promociones);
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
        GESTIÓN DE PROMOCIONES
      </h2>

      <form onSubmit={handleSubmit} className="widget-body">
        <legend><strong>Formulario de Promoción</strong></legend>
        <Table responsive>
          <tbody>
            <tr>
              <td><label htmlFor="nombre_promocion">Nombre de la Promoción</label></td>
              <td>
                <input
                  id="nombre_promocion"
                  name="nombre_promocion"
                  value={formData.nombre_promocion}
                  onChange={handleChange}
                  placeholder="Nombre de la promoción"
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
                  placeholder="Descripción breve"
                  type="text"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="porcentaje_descuento">Porcentaje de Descuento</label></td>
              <td>
                <input
                  id="porcentaje_descuento"
                  name="porcentaje_descuento"
                  value={formData.porcentaje_descuento}
                  onChange={handleChange}
                  placeholder="Porcentaje"
                  type="number"
                  className="form-control"
                  required
                  step="0.01"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="fecha_inicio">Fecha Inicio</label></td>
              <td>
                <input
                  id="fecha_inicio"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  type="date"
                  className="form-control"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="fecha_fin">Fecha Fin</label></td>
              <td>
                <input
                  id="fecha_fin"
                  name="fecha_fin"
                  value={formData.fecha_fin}
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
            {editingPromocion && (
              <tr>
                <td><label htmlFor="usuario_mod">Usuario que edita</label></td>
                <td>
                  <input
                    id="usuario_mod"
                    name="usuario_mod"
                    value={formData.usuario_mod}
                    onChange={handleChange}
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
              {editingPromocion ? 'Actualizar' : 'Agregar'}
            </button>
            {editingPromocion && (
              <button type="button" className="btn btn-default" onClick={() => setEditingPromocion(null)}>
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
            Tabla <span className="fw-semi-bold">Promociones</span>
          </h5>
        }
        settings
        close
      >
        <Table responsive className="table-bordered table-lg mt-lg mb-0">
          <thead className="text-uppercase">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Descuento (%)</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromociones.map((promocion) => (
              <tr key={promocion.promocion_id}>
                <td>{promocion.nombre_promocion}</td>
                <td>{promocion.descripcion}</td>
                <td>{promocion.porcentaje_descuento}</td>
                <td>{new Date(promocion.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(promocion.fecha_fin).toLocaleDateString()}</td>
                <td style={{ display: 'flex', justifyContent: 'center' }}>
                  {promocion.status === 'A' ? (
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
                    onClick={() => handleEdit(promocion)}
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

export default Promocion;
