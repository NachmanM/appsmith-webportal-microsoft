export default {
	runMyApisSequentially: async () => {
		const vmName = input_vm_name.text;
		let tempMoid = null;

		try {
			const insertResult = await Insert_Pending_VM.run();

			// Extract the 'pending-...' MOID returned by PostgreSQL
			tempMoid = insertResult[0].vm_moid; 

			// This is for the popup that has the option to go to VM
			storeValue('new_vm_moid', tempMoid);

			const rawUuid = tempMoid.replace('pending-', '');
			// 3. Immediately refresh the Tree UI to display the pending VM
			await get_vm_cached.run();

			// 4. Lock UI interactions during API handoff
			showModal('modal_vm_creation');

			const apiResponse = await create_vm.run({ transaction_uuid: rawUuid });

			closeModal('modal_vm_creation');
			showAlert(`Provisioning complete for VM: ${vmName}.`, "success");

			// 2. Extract the real MOID from the FastAPI JSON payload
			const realMoid = apiResponse.real_moid
			if (realMoid) {
                navigateTo('DetailsVM', { "vm_moid": realMoid }, 'SAME_WINDOW');
            }
		} catch (error) {
			// 8. Critical Rollback Procedure
			// If create_vm.run() or any other step fails/times out, purge the synthetic database record.
			if (tempMoid) {
				await Delete_Pending_VM.run({ moid: tempMoid });

				// Force a UI tree refresh to physically remove the orphaned pending VM from the screen.
				await get_vm_cached.run(); 
			}

			closeModal('modal_vm_creation');
			showAlert(`Execution failure for ${vmName}. System state rolled back.`, "error");
			console.error(error);
		}
	}
}