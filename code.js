import { RPM } from "../path.js"
import { THREE } from "../../System/Globals.js";

const pluginName = "Map loop";

const dummy = new THREE.Object3D();

function traverse(mesh, pos = new THREE.Vector3(0, 0, 0), rot = new THREE.Euler(0, 0, 0, "XYZ"), scale = new THREE.Vector3(1, 1, 1))
{
	if (mesh === RPM.Core.Game.current.hero.mesh || mesh.mapLoopPlugin_isClone)
		return;
	if (mesh.isMesh)
	{
		const m = RPM.Scene.Map.current;
		const x = RPM.Datas.Systems.SQUARE_SIZE * m.mapProperties.length;
		const z = RPM.Datas.Systems.SQUARE_SIZE * m.mapProperties.width;
		if (!mesh.mapLoopPlugin_hasClone)
		{
			const inst = [];
			for (var i = 0; i < 8; i++)
			{
				inst.push(mesh.clone(false));
				inst[i].morphTargetInfluences = mesh.morphTargetInfluences;
				inst[i].mapLoopPlugin_isClone = true;
				m.scene.add(inst[i]);
			}
			mesh.mapLoopPlugin_hasClone = inst;
		}
		const inst = mesh.mapLoopPlugin_hasClone;
		var i = 0;
		for (var j = 0; j < 3; j++)
		{
			for (var k = 0; k < 3; k++)
			{
				if (j * 3 + k === 4)
					continue;
				inst[i].position.set((1 - j) * x, 0, (1 - k) * z);
				inst[i].rotation.copy(mesh.rotation);
				inst[i].scale.copy(mesh.scale);
				i++;
			}
		}
	}
	pos.add(mesh.position);
	rot.set(rot.x + mesh.rotation.x, rot.y + mesh.rotation.y, rot.z + mesh.rotation.z, "XYZ");
	scale.multiplyVectors(scale, mesh.scale);
	for (var i = 0; i < mesh.children.length; i++)
		traverse(mesh.children[i], pos, rot, scale);
}

setInterval(function ()
{
	if (RPM.Manager.Stack.top instanceof RPM.Scene.Map && !RPM.Scene.Map.current.loading)
	{
		const m = RPM.Scene.Map.current;
		if (m.mapLoopPlugin_loopX || m.mapLoopPlugin_loopZ)
			for (var i = 0; i < m.scene.children.length; i++)
				traverse(m.scene.children[i]);
	}
}, 16);

RPM.Manager.Plugins.registerCommand(pluginName, "Set map loop", (x, z) =>
{
	const m = RPM.Scene.Map.current;
	m.mapLoopPlugin_loopX = x;
	m.mapLoopPlugin_loopZ = z;
});
