export default {
	runMyApisSequentially: async () => {
		try {
			const vm_name = input_vm_name.text
			// 1. Run the initial API call and wait for it to finish
			await get_ip.run();

			// 2. Notify the user of the expected duration
			showModal('modal_vm_creation');

			// 3. Run the POST API call and wait for it to finish
			await create_vm.run();

			// 4. Run the final API call after the POST API succeeds
			await get_ip.run();

			closeModal('modal_vm_creation')

			// 5. Notify the user of success
			showAlert(`The VM ${vm_name} has been created successfully.`, "success");
		} catch (error) {
			// Handle any errors that occur at any stage in the chain
			showAlert("An error occurred during execution.", "error");
			console.error(error);
		}
	}
}