import Widget from '../../components/Widget'; 
import React, { useEffect, useState } from 'react'; 
import axios from 'axios'; 
import { Table } from 'reactstrap';

const API_URL = 'https://api-iv1i.onrender.com/promocion_producto'; 
const PROMOCIONES_URL = 'https://api-iv1i.onrender.com/promocion'; 
const PRODUCTOS_URL = 'https://api-iv1i.onrender.com/producto';

const PromocionProducto = () => { 
  const [promocionProductos, setPromocionProductos] = useState([]); 
  const [promociones, setPromociones] = useState([]); 
  const [productos, setProductos] = useState([]); 
  const [editingPromoProd, setEditingPromoProd] = useState(null); 
  const [formData, setFormData] = useState({ 
    promocion_id: '', 
    producto_id: '', 
    status: 'A', 
    usuario_mod: '', 
  }); 
  const [successMessage, setSuccessMessage] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => { 
    fetchPromocionProductos(); 
    fetchPromociones(); 
    fetchProductos(); 
  }, []);

  const fetchPromocionProductos = async () => { 
    try { 
      const response = await axios.get(API_URL); 
      setPromocionProductos(response.data); 
    } catch (error) { 
      console.error('Error fetching promocion productos:', error); 
      setErrorMessage('Error al cargar las promociones de productos. Inténtalo de nuevo más tarde.'); 
    } 
  };

  const fetchPromociones = async () => { 
    try { 
      const response = await axios.get(PROMOCIONES_URL); 
      setPromociones(response.data.filter(promo => promo.status === 'A')); // Solo promociones activas 
    } catch (error) { 
      console.error('Error fetching promociones:', error); 
      setErrorMessage('Error al cargar las promociones. Inténtalo de nuevo más tarde.'); 
    } 
  };

  const fetchProductos = async () => { 
    try { 
      const response = await axios.get(PRODUCTOS_URL); 
      setProductos(response.data.filter(producto => producto.status === 'A')); // Solo productos activos 
    } catch (error) { 
      console.error('Error fetching productos:', error); 
      setErrorMessage('Error al cargar los productos. Inténtalo de nuevo más tarde.'); 
    } 
  };

  useEffect(() => { 
    if (editingPromoProd) { 
      setFormData({ 
        promocion_id: editingPromoProd.promocion_id, 
        producto_id: editingPromoProd.producto_id, 
        status: editingPromoProd.status, 
        usuario_mod: '', 
      }); 
    } else { 
      resetForm(); 
    } 
  }, [editingPromoProd]);

  const resetForm = () => { 
    setFormData({ 
      promocion_id: '', 
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
      if (editingPromoProd) { 
        await axios.put(`${API_URL}/${editingPromoProd.promocion_producto_id}`, formData); 
        setSuccessMessage('Promoción de producto actualizada exitosamente!'); 
      } else { 
        await axios.post(API_URL, formData); 
        setSuccessMessage('Promoción de producto guardada exitosamente!'); 
      } 
      fetchPromocionProductos(); 
      setEditingPromoProd(null); 
      resetForm(); 
    } catch (error) { 
      setErrorMessage('Error guardando la promoción de producto. Inténtalo de nuevo.'); 
      console.error('Error details:', error.response ? error.response.data : error.message); 
    } 
  };

  const handleEdit = (promoProd) => { 
    setEditingPromoProd(promoProd); 
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
        GESTIÓN DE PROMOCIONES DE PRODUCTOS 
      </h2>

      <form onSubmit={handleSubmit} className="widget-body"> 
        <legend><strong>Formulario de Promoción de Producto</strong></legend> 
        <Table responsive>
          <tbody> 
            <tr> 
              <td><label htmlFor="promocion_id">Promoción</label></td> 
              <td> 
                <select 
                  id="promocion_id" 
                  name="promocion_id" 
                  value={formData.promocion_id} 
                  onChange={handleChange} 
                  className="form-control" 
                  required 
                > 
                  <option value="" disabled>Selecciona una promoción</option> 
                  {promociones.map((promo) => ( 
                    <option key={promo.promocion_id} value={promo.promocion_id}> 
                      {promo.nombre_promocion} 
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
            {editingPromoProd && (
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
              {editingPromoProd ? 'Actualizar' : 'Agregar'} 
            </button> 
            {editingPromoProd && ( 
              <button type="button" className="btn btn-default" onClick={() => setEditingPromoProd(null)}> 
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
            Promociones de Productos <span className="fw-semi-bold">Gestionadas</span> 
          </h5> 
        } 
        settings 
        close 
      > 
        <Table responsive className="table-bordered table-lg mt-lg mb-0"> 
          <thead className="text-uppercase"> 
            <tr> 
              <th>Promoción</th> 
              <th>Producto</th> 
              <th>Status</th> 
              <th>Acciones</th> 
            </tr> 
          </thead> 
          <tbody> 
            {promocionProductos.map((promoProd) => { 
              // Busca la promoción y el producto correspondientes 
              const promocion = promociones.find(p => p.promocion_id === promoProd.promocion_id); 
              const producto = productos.find(p => p.producto_id === promoProd.producto_id);

              return ( 
                <tr key={promoProd.promocion_producto_id}> 
                  <td>{promocion ? promocion.nombre_promocion : 'Promoción no encontrada'}</td> 
                  <td>{producto ? producto.nombre : 'Producto no encontrado'}</td>

                  <td style={{ display: 'flex', justifyContent: 'center' }}> 
                    {promoProd.status === 'A' ? ( 
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
                      onClick={() => handleEdit(promoProd)} 
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

export default PromocionProducto
