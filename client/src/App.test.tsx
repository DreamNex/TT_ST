import React from 'react';
import axios from 'axios';
import '@testing-library/jest-dom';
import App from './App';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
    mockedAxios.post.mockClear();
  });

  // Test 1: Renders the component correctly
  it('should render the file input, search input, and buttons', () => {
    render(<App />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/upload/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/clear/i)).toBeInTheDocument();
  });

  // Test 2: Upload a file (Mocking file upload)
  it('should upload a file successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: 'File uploaded successfully' });
    
    render(<App />);
    
    //const fileInput = screen.getByLabelText(/file/i) as HTMLInputElement;
    const fileInput = screen.getByTestId('file') as HTMLInputElement;
    const file = new File(['sample'], 'test.csv', { type: 'text/csv' });
    
    // Upload file
   await userEvent.upload(fileInput, file);
   expect(fileInput.files[0]).toBe(file)

  });

  // Test 3: Fetch data after upload 
  it('should fetch and display data after file upload', async () => {
    const mockData = {
      data: [{ name: 'John', age: 30 }],
      totalPages: 1
    };
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    render(<App />);

    const uploadButton = screen.getByTestId('upload');
    fireEvent.click(uploadButton);

    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toBe(1);
  });
  
});
