<?php
	if($_SERVER["REQUEST_METHOD"]=="POST"){
		$curl = curl_init();
		curl_setopt_array($curl, array(
		CURLOPT_URL => 'http://primaria.spring.informaticapp.com:4040/restful/registros',
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => 'POST',
		CURLOPT_POSTFIELDS =>'{
			"nombres":"'.$_POST['nombres'].'",
			"apellidos":"'.$_POST['apellidos'].'",
			"email":"'.$_POST['email'].'",
			"cliente_id":"",
			"llave_secreta":"",
			"access_token":""
		}
		',
		CURLOPT_HTTPHEADER => array(
			'Content-Type: application/json'
		),
		));

		$response = curl_exec($curl);

		curl_close($curl);
		$data = json_decode($response);

		//PARA OBTENCION DEL TOKEN
		$curl = curl_init();

		curl_setopt_array($curl, array(
			CURLOPT_URL => 'http://primaria.spring.informaticapp.com:4040/restful/token',
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => '',
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 0,
			CURLOPT_FOLLOWLOCATION => true,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => 'POST',
			CURLOPT_POSTFIELDS =>'{
			
				"cliente_id":"'.$data->cliente_id.'",
				"llave_secreta": "'.$data->email.$data->nombres.$data->apellidos.'"
			}
			',
			CURLOPT_HTTPHEADER => array(
				'Content-Type: application/json'
			),
		));

		$response = curl_exec($curl);

		curl_close($curl);
		$resultado = json_decode($response);
	}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Escuelita - Sistema de Autenticación</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'primary': '#15297c',
                        'primary-dark': '#0f1c4d',
                        'primary-light': '#3d5afe',
                        'optional': '#041557',
						'optional-light': '#9dacf9',
                        'success': '#2ecc71',
                        'warning': '#f1c40f',
                        'error': '#e74c3c'
                    }
                }
            }
        }
    </script>
    <style>
        /* Fondo celeste elegante y simple */
        body {
            background: linear-gradient(135deg, #fffaf0 0%, #9dacf9 100%);
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-4xl">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">

            <!-- Header -->
            <div class="bg-gradient-to-r from-primary to-primary-dark text-white p-10 text-center">
                <!-- Logo -->
                <div class="flex justify-center mb-4">
                    <img src="https://image2url.com/r2/default/images/1772138737667-40b87bef-d32b-42bc-8e9e-11ef0d404377.png" alt="Logo Escuelita" class="w-40 h-40 object-cover rounded-full border-4 border-white shadow-2xl">
                </div>

				<!-- Nombre del negocio -->
                <h1 class="text-3xl md:text-4xl font-bold mb-2">Escuelita</h1>
                <p class="text-lg font-semibold text-primary-light mb-1">Para Escuelas Primarias</p>
                <p class="text-blue-100 text-base">API de Autenticación - Solicita tu Token de Acceso</p>
            </div>

            <!-- Content -->
            <div class="p-8 md:p-10">
                <!-- Info Box -->
                <div class="bg-blue-50 border-l-4 border-primary p-5 rounded-lg mb-8">
                    <div class="flex items-start">
                        <svg class="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="text-gray-700 leading-relaxed">
                            Bienvenido al sistema de autenticación. Esta plataforma permite el acceso a nuestra API para gestionar 
                            información educativa. Ingresa tus datos para obtener un token de acceso único que te permitirá 
                            realizar operaciones en el sistema.
                        </p>
                    </div>
                </div>

                <!-- Token Result -->
				<?php if($_SERVER["REQUEST_METHOD"] == "POST") : ?>
                <div class="bg-gradient-to-r from-success to-green-600 text-white p-6 rounded-2xl mb-8">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h4 class="text-xl font-semibold">Token Generado Exitosamente</h4>
                        </div>
                        <button onclick="copiarToken()" class="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <span class="font-semibold">Copiar</span>
                        </button>
                    </div>
                    <div id="tokenText" class="bg-white bg-opacity-20 p-4 rounded-xl break-all font-mono text-sm">

                <?php echo $resultado->token; ?>
                    </div>
                    <div class="flex items-start mt-4 text-green-50">
                        <svg class="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <small>Guarda este token en un lugar seguro. Lo necesitarás para autenticarte en el sistema.</small>
                    </div>
                </div>
				<?php endif; ?>

                <!-- Form -->
                <div>
                    <div class="flex items-center mb-6">
                        <svg class="w-7 h-7 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                        <h3 class="text-2xl font-semibold text-gray-800">Solicitud de Token</h3>
                    </div>
                    <form method="post" class="space-y-6">
                        <!-- Nombres -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <input type="text" name="nombres" class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition duration-200" placeholder="Ingresa tus nombres" required>
                            </div>
                        </div>
                        <!-- Apellidos -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                                    </svg>
                                </div>
                                <input type="text" name="apellidos" class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition duration-200" placeholder="Ingresa tus apellidos" required>
                            </div>
                        </div>
                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <input type="email" name="email" class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition duration-200" placeholder="ejemplo@correo.com" required>
                            </div>
                        </div>
                        <!-- Submit Button -->
                        <button type="submit" class="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-optional text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                            </svg>
                            Generar Token de Acceso
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script>
        function copiarToken() {
            const tokenElement = document.getElementById('tokenText');
            const tokenText = tokenElement.innerText.trim();
            // Método alternativo que funciona en HTTP
            const textarea = document.createElement('textarea');
            textarea.value = tokenText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.setSelectionRange(0, 99999); // Para móviles
            let exitoso = false;
            try {
                exitoso = document.execCommand('copy');
            } catch (err) {
                console.error('Error al copiar:', err);
            }
            document.body.removeChild(textarea);
            if (exitoso) {
                // Cambiar el botón temporalmente para feedback
                const boton = event.currentTarget;
                const textoOriginal = boton.innerHTML;
                boton.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="font-semibold">¡Copiado!</span>
                `;
                boton.classList.add('bg-opacity-40');
                setTimeout(() => {
                    boton.innerHTML = textoOriginal;
                    boton.classList.remove('bg-opacity-40');
                }, 2000);
            } else {
                alert('No se pudo copiar automáticamente. Selecciona el token y copia con Ctrl+C');
            }
        }
    </script>
</body>
</html>