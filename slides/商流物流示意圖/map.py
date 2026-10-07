import json, math, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
LON0,LON1,LAT0,LAT1=98,130,18.5,34.7
W,H=13.333,7.5
d=json.load(open("geo/countries.geojson"))
fig=plt.figure(figsize=(W,H),dpi=200)
ax=fig.add_axes([0,0,1,1]); ax.set_xlim(LON0,LON1); ax.set_ylim(LAT0,LAT1); ax.axis("off")
fig.patch.set_facecolor("#DCE9F2"); ax.set_facecolor("#DCE9F2")
# graticule
for lo in range(100,131,5): ax.plot([lo,lo],[LAT0,LAT1],color="#C9DAE6",lw=0.6,zorder=0)
for la in range(20,35,5): ax.plot([LON0,LON1],[la,la],color="#C9DAE6",lw=0.6,zorder=0)
hl={"CHN","TWN","HKG","MAC"}
for f in d["features"]:
    name=f["properties"]["ADM0_A3"]
    g=f["geometry"]; polys=g["coordinates"] if g["type"]=="MultiPolygon" else [g["coordinates"]]
    fc="#FBFCFD" if name in hl else "#E6EAEE"
    for p in polys:
        ax.add_patch(Polygon(p[0],closed=True,fc=fc,ec="#9FB3C2",lw=0.7,zorder=1))
fig.savefig("map_bg.png",dpi=200,facecolor="#DCE9F2")
