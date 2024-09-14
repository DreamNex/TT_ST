import React, { useState} from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css';

const App: React.FC = () => {

  const[file, setFile] = useState<File | null>(null);
  const[data, setData] = useState<any[]>([]);
  const[pageCount, setPageCount] = useState(0);
  const[loading, setLoading] = useState(false);
  const[searchTerm, setSearchTerm] = useState("");

  const handlePageClick = (event: {selected: number}) => {
    fetchData(event.selected +1);
  };

  //Upload file
  const uploadFile = async () => {
    if(!file) return;
    const formData = new FormData();
    formData.append('file',file);

    try{
      setLoading(true);
      const response = await axios.post(`http://localhost:7001/uploadfile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded',response.data);
      fetchData(1);
    }catch(err){
      console.error('Error uploading of file', err);
    }finally{
      setLoading(false);
    }
  };

  const fetchData = async (currentPage: number) => {
    try{
      setLoading(true);
      const response = await axios.get(`http://localhost:7001/showdata?page=${currentPage}&limit=10`);
      setData(response.data.data);
      setPageCount(response.data.totalPages);
    }catch (err){
      console.error('Error while fetching data', err);
    }finally{
      setLoading(false);
    }

  };

  //Search/filter Data
  const searchData = async (query: string) => {
    try{
      setLoading(true);
      const response = await axios.get(`http://localhost:7001/searchdata?q=${query}`);
      setData(response.data.data);
      setPageCount(1);
    }
    catch (err){
      console.error('Error while searching data', err);
    }
    finally{
      setLoading(false);
    }
  };






  return (
    <div className="App">
      <header className="CSV Application"></header>
       <h1>CSV Application</h1>

       {/*For file upload*/}
       <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}/>
       <button onClick={uploadFile} disabled={!file || loading}>
        {loading ? 'Uploading file..' : 'Upload'}
       </button>

       {/*For search data*/}
       <input type="text" placeholder='Search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
       onKeyDown={(e) => e.key === 'Enter' && searchData(searchTerm)} />
       <button onClick={()=> searchData(searchTerm)}>Search</button>


       {/*For Data*/}
       {loading ? <p>Loading...</p> :(
        <>
        <table>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key)=>(
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row,idx)=>(
              <tr key={idx}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>
                    {value !== null && value !== undefined
                      ? typeof value === 'object'
                        ? JSON.stringify(value)
                        : value.toString()
                      : 'N/A'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/*pagination*/}
        {pageCount > 1 && (
          <ReactPaginate previousLabel={"previous"} nextLabel={"next"} breakLabel={"...."} pageCount={pageCount}
          marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handlePageClick} containerClassName={"pagination"}
          activeClassName={'active'}/>
        )}
        </>
       )}

    </div>
  );

}
  

export default App;
