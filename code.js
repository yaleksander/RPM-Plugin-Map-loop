import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Map loop";

const dummy = new THREE.Object3D();

setInterval(function ()
{
    if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
    {
		const x = RPM.Datas.Systems.SQUARE_SIZE * RPM.Scene.Map.current.mapProperties.length;
		const z = RPM.Datas.Systems.SQUARE_SIZE * RPM.Scene.Map.current.mapProperties.width;
		const s = RPM.Scene.Map.current.scene;
		for (var i = 0; i < s.children.length; i++)
		{
			console.log(s.children[i]);
			if (!s.children[i].isMesh)
				continue;
			const mesh = s.children[i];
			if (!mesh.mapLoopPlugin_instancedMesh)
			{
				const geo = mesh.geometry;
				const mat = mesh.material;
				const inst = new THREE.InstancedMesh(geo, mat, 8);
				inst.castShadow = true;
				inst.receiveShadow = true;
				inst.customDepthMaterial = mesh.customDepthMaterial;
				inst.customDistanceMaterial = mesh.customDistanceMaterial;
				mesh.mapLoopPlugin_instancedMesh = inst;
				console.log(inst);
//				s.add(inst);
			}
			else
			{
				const geo = mesh.geometry;
				const mat = mesh.material;
				const inst = mesh.mapLoopPlugin_instancedMesh;
				var count = 0;
				for (var j = 0; j < 3; j++)
				{
					for (var k = 0; k < 3; k++)
					{
						if (j * 3 + k === 4)
							continue;
						dummy.position.set((1 - j) * x + mesh.position.x, mesh.position.y, (1 - k) * z + mesh.position.z);
						dummy.rotation.copy(mesh.rotation);
						dummy.updateMatrix();
						inst.setMatrixAt(count++, dummy.matrix);
					}
				}
				inst.instanceMatrix.needsUpdate = true;
			}
		}
	}
}, 16);

RPM.Manager.Plugins.registerCommand(pluginName, "Set map loop", (x, z) =>
{
	
});