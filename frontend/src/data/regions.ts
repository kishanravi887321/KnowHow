/**
 * Indian regions and cities for mock data generation
 */

export interface Region {
  name: string;
  state: string;
  coordinates: [number, number]; // [lng, lat]
  bounds: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  population: number;
  area: number; // sq km
  type: 'city' | 'district' | 'metropolitan' | 'hill_station';
  elevation: number; // meters
}

export const MAJOR_REGIONS: Region[] = [
  // North India
  { name: 'Delhi NCR', state: 'Delhi', coordinates: [77.2090, 28.6139], bounds: [76.8, 28.4, 77.6, 28.9], population: 32941000, area: 1484, type: 'metropolitan', elevation: 216 },
  { name: 'Jaipur', state: 'Rajasthan', coordinates: [75.7873, 26.9124], bounds: [75.5, 26.7, 76.1, 27.2], population: 3046163, area: 484, type: 'city', elevation: 431 },
  { name: 'Lucknow', state: 'Uttar Pradesh', coordinates: [80.9462, 26.8467], bounds: [80.7, 26.6, 81.2, 27.1], population: 2817105, area: 349, type: 'city', elevation: 123 },
  { name: 'Dehradun', state: 'Uttarakhand', coordinates: [78.0322, 30.3165], bounds: [77.8, 30.1, 78.3, 30.5], population: 578420, area: 300, type: 'hill_station', elevation: 682 },
  { name: 'Shimla', state: 'Himachal Pradesh', coordinates: [77.1734, 31.1048], bounds: [77.0, 30.9, 77.4, 31.3], population: 169578, area: 35, type: 'hill_station', elevation: 2206 },
  { name: 'Chandigarh', state: 'Punjab', coordinates: [76.7794, 30.7333], bounds: [76.6, 30.6, 77.0, 30.9], population: 1055450, area: 114, type: 'city', elevation: 321 },
  { name: 'Amritsar', state: 'Punjab', coordinates: [74.8723, 31.6340], bounds: [74.6, 31.4, 75.1, 31.8], population: 1132383, area: 170, type: 'city', elevation: 234 },
  { name: 'Jammu', state: 'Jammu & Kashmir', coordinates: [74.8570, 32.7266], bounds: [74.6, 32.5, 75.1, 33.0], population: 502197, area: 240, type: 'city', elevation: 327 },

  // West India
  { name: 'Mumbai', state: 'Maharashtra', coordinates: [72.8777, 19.0760], bounds: [72.7, 18.9, 73.1, 19.3], population: 20411000, area: 603, type: 'metropolitan', elevation: 14 },
  { name: 'Pune', state: 'Maharashtra', coordinates: [73.8567, 18.5204], bounds: [73.6, 18.3, 74.1, 18.7], population: 6629347, area: 331, type: 'city', elevation: 560 },
  { name: 'Ahmedabad', state: 'Gujarat', coordinates: [72.5714, 23.0225], bounds: [72.3, 22.8, 72.8, 23.2], population: 7681000, area: 464, type: 'city', elevation: 53 },
  { name: 'Surat', state: 'Gujarat', coordinates: [72.8311, 21.1702], bounds: [72.6, 21.0, 73.0, 21.3], population: 6936534, area: 326, type: 'city', elevation: 13 },
  { name: 'Nashik', state: 'Maharashtra', coordinates: [73.7898, 19.9975], bounds: [73.5, 19.8, 74.0, 20.2], population: 1486053, area: 267, type: 'city', elevation: 565 },
  { name: 'Vadodara', state: 'Gujarat', coordinates: [73.1812, 22.3072], bounds: [72.9, 22.1, 73.4, 22.5], population: 2065771, area: 235, type: 'city', elevation: 35 },
  { name: 'Rajkot', state: 'Gujarat', coordinates: [70.7877, 22.3039], bounds: [70.5, 22.1, 71.0, 22.5], population: 1390640, area: 170, type: 'city', elevation: 128 },
  { name: 'Indore', state: 'Madhya Pradesh', coordinates: [75.8577, 22.7196], bounds: [75.6, 22.5, 76.1, 22.9], population: 2170295, area: 530, type: 'city', elevation: 553 },

  // South India
  { name: 'Bengaluru', state: 'Karnataka', coordinates: [77.5946, 12.9716], bounds: [77.4, 12.8, 77.8, 13.1], population: 12339000, area: 741, type: 'metropolitan', elevation: 920 },
  { name: 'Chennai', state: 'Tamil Nadu', coordinates: [80.2707, 13.0827], bounds: [80.1, 12.9, 80.4, 13.2], population: 10971000, area: 426, type: 'metropolitan', elevation: 14 },
  { name: 'Hyderabad', state: 'Telangana', coordinates: [78.4867, 17.3850], bounds: [78.2, 17.1, 78.7, 17.6], population: 9482000, area: 650, type: 'metropolitan', elevation: 542 },
  { name: 'Kochi', state: 'Kerala', coordinates: [76.2673, 9.9312], bounds: [76.1, 9.8, 76.5, 10.1], population: 2119724, area: 94, type: 'city', elevation: 1 },
  { name: 'Thiruvananthapuram', state: 'Kerala', coordinates: [76.9366, 8.5241], bounds: [76.7, 8.3, 77.1, 8.7], population: 957730, area: 214, type: 'city', elevation: 61 },
  { name: 'Coimbatore', state: 'Tamil Nadu', coordinates: [76.9558, 11.0168], bounds: [76.7, 10.8, 77.2, 11.2], population: 2136916, area: 246, type: 'city', elevation: 411 },
  { name: 'Mysuru', state: 'Karnataka', coordinates: [76.6394, 12.2958], bounds: [76.4, 12.1, 76.8, 12.5], population: 990900, area: 155, type: 'city', elevation: 770 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', coordinates: [83.2185, 17.6868], bounds: [83.0, 17.5, 83.4, 17.9], population: 2035922, area: 681, type: 'city', elevation: 45 },

  // East India
  { name: 'Kolkata', state: 'West Bengal', coordinates: [88.3639, 22.5726], bounds: [88.1, 22.4, 88.6, 22.7], population: 14850000, area: 205, type: 'metropolitan', elevation: 9 },
  { name: 'Bhubaneswar', state: 'Odisha', coordinates: [85.8245, 20.2961], bounds: [85.6, 20.1, 86.0, 20.5], population: 885363, area: 135, type: 'city', elevation: 45 },
  { name: 'Guwahati', state: 'Assam', coordinates: [91.7362, 26.1445], bounds: [91.5, 26.0, 91.9, 26.3], population: 957352, area: 216, type: 'city', elevation: 55 },
  { name: 'Patna', state: 'Bihar', coordinates: [85.1376, 25.5941], bounds: [84.9, 25.4, 85.3, 25.7], population: 2049156, area: 135, type: 'city', elevation: 53 },
  { name: 'Ranchi', state: 'Jharkhand', coordinates: [85.3096, 23.3441], bounds: [85.1, 23.1, 85.5, 23.5], population: 1073427, area: 175, type: 'city', elevation: 651 },
  { name: 'Raipur', state: 'Chhattisgarh', coordinates: [81.6296, 21.2514], bounds: [81.4, 21.0, 81.8, 21.4], population: 1010433, area: 226, type: 'city', elevation: 298 },

  // Central India
  { name: 'Bhopal', state: 'Madhya Pradesh', coordinates: [77.4126, 23.2599], bounds: [77.2, 23.0, 77.6, 23.5], population: 1798218, area: 463, type: 'city', elevation: 499 },
  { name: 'Nagpur', state: 'Maharashtra', coordinates: [79.0882, 21.1458], bounds: [78.8, 20.9, 79.3, 21.3], population: 2405665, area: 227, type: 'city', elevation: 310 },
];

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
] as const;

export function getRandomRegion(): Region {
  return MAJOR_REGIONS[Math.floor(Math.random() * MAJOR_REGIONS.length)];
}

export function getRegionsByState(state: string): Region[] {
  return MAJOR_REGIONS.filter(r => r.state === state);
}

export function getNearbyRegions(
  coordinates: [number, number],
  radiusKm: number = 200
): Region[] {
  const [lng, lat] = coordinates;
  return MAJOR_REGIONS.filter(region => {
    const [rLng, rLat] = region.coordinates;
    const distance = Math.sqrt(
      Math.pow((rLng - lng) * 111, 2) + Math.pow((rLat - lat) * 111, 2)
    );
    return distance <= radiusKm;
  });
}

export function generateRandomAlert(): Region {
  return MAJOR_REGIONS[Math.floor(Math.random() * MAJOR_REGIONS.length)];
}