# SustainWater site elements

The code behind the custom elements on sustainwater.uk: the homepage and the hub pages.
Each Wix page loads its file from here through jsDelivr, e.g.
https://cdn.jsdelivr.net/gh/benaled/sustainwater-elements@main/sw-home.js

Built by hub_build (kept in the SustainWater hubs folder). Don't edit these files by hand; rebuild and replace them.

## data/district-facts.json

The "Your area" report on every hub reads this one small file: for each UK postcode district, the housing-age estimate,
water company, hardness area and fluoride area, taken at the centre of the district. It is built from the same public
data as the UK testing map (SWMAP/Map: EPC housing age, Ofwat water company boundaries, DWI hardness and fluoride areas),
with district centres from Gibbs/uk-postcodes.

Contains OS data © Crown copyright and database right. Contains public sector information licensed under the
Open Government Licence v3.0.
