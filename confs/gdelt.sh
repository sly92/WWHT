#!/usr/bin/env bash
# sudo apt-get install liblapack-dev libblas-dev gfortran git
sudo yum install -y git-core lapack-devel blas-devel gcc-gfortran
sudo python3 -m pip install -U pyarrow pandas keras np_utils tensorflow flask
sudo python3 -m pip install -U git+https://github.com/maxpumperla/elephas.git

