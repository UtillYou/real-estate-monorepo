import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import { fetchListings, Listing } from '../api/listings';

const ListingsList: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchListings()
      .then(res => setListings(res.data))
      .catch(() => message.error('Failed to load listings'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin />;

  return (
    <Row gutter={[16, 16]}>
      {listings.map(listing => (
        <Col xs={24} sm={12} md={8} lg={6} key={listing.id}>
          <Card
            title={listing.title}
            cover={listing.images && listing.images.length > 0 ? (
              <img 
                src={listing.images?.[0]?.url} 
                alt={listing.title} 
                style={{ height: 200, objectFit: 'cover' }} 
              />
            ) : null}
          >
            <p><b>Price:</b> ${listing.price}</p>
            <p><b>Address:</b> {listing.address}</p>
            <p>{listing.description}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ListingsList;
