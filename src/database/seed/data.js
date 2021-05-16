import BcryptUtil from '../../utils/Bcrypt.util';

const data = {
  users: [
    {
      fullName: 'Tonton',
      firstName: 'Tonton',
      lastName: 'Tonton',
      email: 'admin@sample.com',
      phoneNumber: '+250788558899',
      password: BcryptUtil.hashPassword(process.env.PASSWORD),
      role: 'Manager',
      companyName: 'Timecapsule 3D',
      companyUrl: 'http://timecapsule.com',
      address: 'Kigali, RWanda',
      city: 'Kigali',
      country: 'Rwanda',
    },
    {
      fullName: 'Maombi',
      firstName: 'Maombi',
      lastName: 'Maombi',
      email: 'maombi@test.com',
      phoneNumber: '+250788558899',
      password: BcryptUtil.hashPassword(process.env.PASSWORD),
      role: 'Client',
      companyName: 'Timecapsule 3D',
      companyUrl: 'http://timecapsule.com',
      address: 'Kigali, RWanda',
      city: 'Kigali',
      country: 'Rwanda',
    },
    {
      fullName: 'Gatete',
      firstName: 'Gatete',
      lastName: 'Gatete',
      email: 'gatete@test.com',
      phoneNumber: '+250788558899',
      password: BcryptUtil.hashPassword(process.env.PASSWORD),
      role: 'Manager',
      companyName: 'Timecapsule 3D',
      companyUrl: 'http://timecapsule.com',
      address: 'Kigali, RWanda',
      city: 'Kigali',
      country: 'Rwanda',
    },
  ],
};

export default data;
