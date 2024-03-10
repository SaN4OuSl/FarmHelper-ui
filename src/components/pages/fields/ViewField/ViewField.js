import React, { useContext, useEffect, useState } from 'react';
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Popup,
  useMapEvents
} from 'react-leaflet';
import { getAreaOfPolygon } from 'geolib';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ErrorContext from '../../../error/ErrorContext';
import { createField, getFieldById, updateField } from '../../../../service/FieldService';
import error from 'eslint-plugin-react/lib/util/error';
import { Box, MenuItem, Select, TextField } from '@material-ui/core';
import { SoilTypes } from '../../../../models/SoilTypes';
import { parseCoordinatesToPoints, parsePointsToCoordinates } from '../../../../utils/pointParser';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
let canAddMarker = true;
// eslint-disable-next-line react/prop-types
const ViewField = ({ isDialogOpened, fieldId, mapCenter, handleClose }) => {
  const [points, setPoints] = useState([]);
  const [area, setArea] = useState(0.0);
  const [fieldName, setFieldName] = useState('');
  const [soilType, setSoilType] = useState('');
  const [, setError] = useContext(ErrorContext);

  useEffect(() => {
    if (fieldId !== undefined) {
      getField();
    }
    let timeout = setTimeout(() => {
      setError('');
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [fieldId, error]);

  useEffect(() => {
    calculateArea();
  }, [points]);

  const saveField = () => {
    if (points.length > 2 && fieldName && soilType) {
      const coordinates = parsePointsToCoordinates(points);
      if (fieldId === undefined) {
        createField(fieldName, coordinates, area, soilType, setError).then(handleCloseDialog);
      } else {
        updateField(fieldId, fieldName, coordinates, area, soilType, setError).then(
          handleCloseDialog
        );
      }
    } else {
      setError('You should choose more than 2 points, a field name, and a soil type.');
    }
  };

  const getField = () => {
    getFieldById(fieldId).then((result) => {
      setPoints(parseCoordinatesToPoints(result.coordinates));
      setSoilType(result.soilType);
      setArea(result.fieldSize);
      setFieldName(result.fieldName);
    });
  };

  const addPoint = (newPoint) => {
    const newPoints = [...points, newPoint];
    setPoints(newPoints);
  };

  const updatePoint = (newPoint, index) => {
    const updatedPoints = [...points];
    updatedPoints[index] = newPoint;
    setPoints(updatedPoints);
  };

  const deletePoint = (indexToDelete) => {
    const remainingPoints = points.filter((_, index) => index !== indexToDelete);
    setPoints(remainingPoints);
    canAddMarker = false;
    setTimeout(() => (canAddMarker = true), 500);
  };

  const calculateArea = () => {
    if (points.length > 2) {
      const pointsForCalculation = points.map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng
      }));
      setArea((getAreaOfPolygon(pointsForCalculation) / 10000).toFixed(2));
    } else {
      setArea(0);
    }
  };

  const handleCloseDialog = () => {
    setPoints([]);
    setArea(0.0);
    setSoilType('');
    setFieldName('');
    handleClose();
  };

  const renderMarkersAndLines = () => {
    return (
      <>
        {points.map((point, index) => (
          <Marker
            key={index}
            position={point}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                updatePoint([lat, lng], index);
              }
            }}>
            <Popup>
              <button onClick={() => deletePoint(index)}>Delete</button>
            </Popup>
          </Marker>
        ))}
        {points.length > 1 && <Polyline color="blue" positions={points} />}
      </>
    );
  };

  return (
    <Dialog open={isDialogOpened} onClose={handleCloseDialog} fullWidth maxWidth="lg">
      <Box display="flex" p={2}>
        <Box flex={3} height="500px">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(map) => (this.map = map)}>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
            <MapEvents addPoint={addPoint} />
            {renderMarkersAndLines()}
            {points.length > 2 && <Polygon positions={points} />}
          </MapContainer>
        </Box>

        <Box flex={1} display="flex" flexDirection="column" ml={2}>
          <TextField
            label="Field Name"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <Select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            margin="normal"
            fullWidth>
            <MenuItem disabled value="">
              <em>Soil Type</em>
            </MenuItem>
            {Object.keys(SoilTypes).map((type) => (
              <MenuItem key={type} value={SoilTypes[type]}>
                {SoilTypes[type]}
              </MenuItem>
            ))}
          </Select>
          <Box mt={2} mb={2} margin="normal">
            Field size: {area} ha
          </Box>
          <Box mt="auto" p={2} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleCloseDialog}
              className="cancel__tags"
              style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button onClick={saveField} className="save__tags">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

// eslint-disable-next-line react/prop-types
const MapEvents = ({ addPoint }) => {
  useMapEvents({
    click: (e) => {
      if (canAddMarker) {
        const newPoint = [e.latlng.lat, e.latlng.lng];
        addPoint(newPoint);
      }
    }
  });
  return null;
};

export default ViewField;
