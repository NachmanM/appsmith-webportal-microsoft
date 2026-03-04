export default {
    runMyApisSequentially: async () => {
        try {
            // 1. Run the initial API call and wait for it to finish
            await get_ip.run();
            
            // 2. Run the POST API call and wait for it to finish
            await create_vm.run();
            
            // 3. Run the final API call after the POST API succeeds
            await get_ip.run();
            
            // Optional: Notify the user of success
            showAlert("All APIs executed successfully", "success");
        } catch (error) {
            // Handle any errors that occur at any stage in the chain
            showAlert("An error occurred during execution", "error");
            console.error(error);
        }
    }
}