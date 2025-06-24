import React from 'react';
import ListingsList from '../components/ListingsList';

const ListingsPage: React.FC = () => {
  return (
    <div>
      <h2>Available Listings</h2>
      <ListingsList />
    </div>
  );
};

export default ListingsPage;
