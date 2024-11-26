import Widget from '../../components/Widget'; 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

const API_URL = 'https://apilimpieza.onrender.com/historial_compras';

const HistorialCompras = () => {
  const [historialCompras, setHistorialCompras] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchHistorialCompras();
  }, []);

  const fetchHistorialCompras = async () => {
    try {
      const response = await axios.get(API_URL);
      setHistorialCompras(response.data);
    } catch (error) {
      console.error('Error fetching historial de compras:', error);
      setErrorMessage('Error al cargar el historial de compras. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="container">
      <h2 className="text-center font-weight-bold my-4">
        HISTORIAL DE COMPRAS
      </h2>

      {errorMessage && (
        <div
          className="alert alert-danger fade show"
          role="alert"
          style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}
        >
          {errorMessage}
        </div>
      )}

<Widget
        title={
          <h5>
            HISTORIAL <span className="fw-semi-bold">COMPRAS</span>
          </h5>
        }
        settings
        close
      >
      <Table className="table-bordered table-lg mt-lg mb-0" responsive>
        <thead className="text-uppercase">
          <tr>
            <th>ID Cliente</th>
            <th>ID Pedido</th>
            <th>Total Compra</th>
            <th>Status</th>
            <th>Empleado Modificador</th>
          </tr>
        </thead>
        <tbody>
          {historialCompras.map((compra) => (
            <tr key={compra.id_pedido}>
              <td>{compra.id_cliente}</td>
              <td>{compra.id_pedido}</td>
              <td>${compra.total_compra.toFixed(2)}</td>
              <td className="text-center">
          {compra.status === 'A' ? (
            <span className="px-2 btn btn-success btn-xs w-100">Activo</span>
          ) : (
            <span className="px-2 btn btn-danger btn-xs w-100">Inactivo</span>
          )}
        </td>
              <td>{compra.empleado_mod}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Widget>
    </div>
  );
};

export default HistorialCompras;
