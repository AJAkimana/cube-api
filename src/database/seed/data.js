import BcryptUtil from '../../utils/Bcrypt.util';

const data = {
  users: [
    {
      fullName: 'Tonton',
      email: 'admin@sample.com',
      phoneNumber: '+250788558899',
      password: BcryptUtil.hashPassword(process.env.PASSWORD),
      role: 'Manager',
      companyName: 'Timecapsule 3D',
      address: 'Kigali, RWanda',
    },
    {
      fullName: 'Maombi',
      email: 'maombi@test.com',
      phoneNumber: '+250788558899',
      password: BcryptUtil.hashPassword(process.env.PASSWORD),
      role: 'Client',
      companyName: 'Timecapsule 3D',
      address: 'Kigali, RWanda',
    },
    {
      fullName: 'Gatete',
      email: 'gatete@test.com',
      phoneNumber: '+250788558899',
      password: BcryptUtil.hashPassword(process.env.PASSWORD),
      role: 'Manager',
      companyName: 'Timecapsule 3D',
      address: 'Kigali, RWanda',
    },
  ],
};

export default data;
