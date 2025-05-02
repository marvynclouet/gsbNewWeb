import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBox, FaEuroSign, FaTags, FaTimes } from 'react-icons/fa';
import api from '../../services/api';
import  { objectToFormData } from '/src/utils/api'
import '../../styles/Admin.css';

const Medicaments = () => {

  const inputFileRef = useRef()

  const [importedImageName, setImportedImageName] = useState('')

  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicament, setEditingMedicament] = useState(null);


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: '',
    image_file: null,
  });


  useEffect(() => {
    fetchMedicaments();
  }, []);

  useEffect(()=>{
    if (medicaments.length > 0) {
      console.log({ medicaments })
      console.log("image_url? :  ", medicaments[0].image_url )
      console.log("http? : ", medicaments[0].image_url.includes('http'))
    }
  },[medicaments])


  const fetchMedicaments = async () => {
    try {
      const data = await api.getMedicaments();
      setMedicaments(data);
    } catch (err) {
      setError('Erreur lors du chargement des médicaments');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicament) {
        const data = objectToFormData(formData)
        if( editingMedicament.id && data ){
          await api.updateMedicament(editingMedicament.id, data);
          setEditingMedicament(null);
        }
      }
      else {
        const data = objectToFormData(formData)
        await api.createMedicament(data);
      }
      setShowForm(false);
      setEditingMedicament(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_url: '',
        image_file: null,
      });
      fetchMedicaments();
    } catch (err) {
      setError('Erreur lors de la sauvegarde du médicament');
      console.error('Erreur:', err);
    }
  };



  const handleEdit = (medicament) => {
    if(medicament){
      setEditingMedicament(medicament);
      console.log({medicament})
      setFormData({
        name: medicament.name,
        description: medicament.description || '',
        price: medicament.price,
        stock: medicament.stock,
        category: medicament.category || '',
        image_url: medicament.image_url && medicament.image_url.includes("http") ? medicament.image_url : "",
        image_file: medicament.image_url && !medicament.image_url.includes("http") ? medicament.image_url : null,
      });
      setShowForm(true);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      try {
        await api.deleteMedicament(id);
        fetchMedicaments();
      } catch (err) {
        setError('Erreur lors de la suppression du médicament');
        console.error('Erreur:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }


  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Médicaments</h1>
        <button 
          className="add-button"
          onClick={() => {
            setEditingMedicament(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              stock: '',
              category: '',
              image_url: '',
              image_file: null,
            });
            setShowForm(true);
          }}
        >
          <FaPlus /> Ajouter un médicament
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            { medicaments.length > 0 && medicaments.map((medicament) => (
              <tr key={medicament.id}>
                <td className="image-cell">
                  <div className="medicament-image">
                    <img 
                      src={ medicament.image_url ? 
                              (medicament.image_url.includes("http") ?
                                    medicament.image_url
                                  : `http://localhost:5000/api/uploads/medicaments/${medicament.image_url}`)
                            : "#"
                      } 
                      alt= 'Image'
                      onError={(e) => e.target.src = '/placeholder.png'}
                    />
                  </div>
                </td>
                <td>{medicament.name}</td>
                <td className="description-cell">
                  {medicament.description || 'Aucune description'}
                </td>
                <td className="price-cell">
                  <div className="price-badge">
                    <FaEuroSign /> {
                      (() => {
                        try {
                          const price = typeof medicament.price === 'number' ? medicament.price : Number(medicament.price);
                          return isNaN(price) ? '0.00' : price.toFixed(2);
                        } catch (err) {
                          console.log(err)
                          return '0.00';
                        }
                      })()
                    }
                  </div>
                </td>
                <td className="stock-cell">
                  <div className={`stock-badge ${medicament.stock < 10 ? 'low-stock' : ''}`}>
                    <FaBox /> {medicament.stock}
                  </div>
                </td>
                <td className="category-cell">
                  <div className="category-badge">
                    <FaTags /> {medicament.category || 'Non catégorisé'}
                  </div>
                </td>
                <td className="actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(medicament)}
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(medicament.id)}
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingMedicament ? 'Modifier le médicament' : 'Ajouter un médicament'}</h2>
            <form onSubmit={handleSubmit} className="medicament-form" encType='multipart/form-data'>
              <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={ handleInputChange }
                    required
                    placeholder="Nom du médicament"
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description du médicament"
                    rows="4"
                  />
              </div>
              <div className="form-row">
                <div className="form-group">
                    <label htmlFor="price">Prix (€)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">Stock</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="0"
                    />
                </div>
              </div>
              <div className="form-group">
                  <label htmlFor="category">Catégorie</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Catégorie du médicament"
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="image_url">URL de l'image</label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    disabled={ !!importedImageName }
                    onChange={ handleInputChange }
                    style={{ backgroundColor: importedImageName && '#f2d7d5', color: 'white ! important'}}
                    placeholder={ importedImageName ? "Lock" : "https://.../nom-du-medicament.jpg" }
                  />
              </div>

              <span className=''>Ou</span>
              <div className="form-group" >
                <label 
                  htmlFor="image_url"
                  className='submit-button'
                  style={{ background: ((typeof formData.image_url === "string" && formData.image_url.trim()).length > 0 ) ? "#f2d7d5" : null }}
                  onClick={()=>{
                    if(inputFileRef.current) inputFileRef.current.click()
                  }}
                >
                  { (formData.image_url && (formData.image_url.trim()).length > 0) ? 
                    "Lock"
                    : (importedImageName ? importedImageName : "Importer une image") 
                  }
                </label>
                  <input
                    hidden
                    type="file"
                    id="image_file"
                    name="image_file"
                    ref={inputFileRef}
                    disabled={ formData.image_url && (formData.image_url.trim()).length > 0  }
                    onChange={()=>{
                      if(inputFileRef.current){
                        const file = inputFileRef.current.files[0];
                        if( file ){
                          setImportedImageName(() => (
                            file.name.length > 30 ? (
                              file.name.substring(0, 20) + '...' + file.name.split('.').pop()
                            ) : (file.name)
                           ))
                          handleInputChange({
                            target: {
                              name: 'image_file',
                              value: file
                            }
                          })
                        }
                      }
                    }}
                    placeholder="/images/nom-du-medicament.jpg"
                  />
                  <FaTimes 
                    style={{ 
                      width:20,
                      right: 10, 
                      height: 20 ,
                      bottom: "50%", 
                      color: "white",
                      cursor: 'pointer',
                      position: 'absolute',
                      transform: "translateY(50%)",
                    }}
                    onClick={()=>{
                      if(importedImageName){
                        setImportedImageName('')
                        console.log(inputFileRef.current.files)
                        handleInputChange({
                          target: {
                            name: 'image_file',
                            value: null,
                          }
                        })
                      }
                    }}
                  />
              </div>

              <div className="modal-buttons">
                  <button type="submit" className="submit-button">
                    {editingMedicament ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowForm(false);
                    }}
                    className="cancel-button"
                  >
                    Annuler
                  </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicaments; 