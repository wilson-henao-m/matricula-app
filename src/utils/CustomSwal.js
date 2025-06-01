import Swal from 'sweetalert2';

const CustomSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-xl border border-gray-200 bg-white',
    title: 'text-black font-bold',
    confirmButton: 'bg-unilibre-red text-white font-semibold cursor-pointer rounded px-6 py-2 mx-2 hover:bg-unilibre-yellow',
    cancelButton: 'bg-gray-200 text-black font-semibold cursor-pointer rounded px-6 py-2 mx-2 hover:bg-gray-300',
    icon: 'text-unilibre-red',
    htmlContainer: 'text-gray-800',
  },
  buttonsStyling: false,
});

export default CustomSwal;
