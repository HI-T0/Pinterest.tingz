import { NextResponse } from 'next/server'
import { Product } from '../../types'

// In-memory storage
let products: Product[] = [
  {
    id: 1,
    name: 'Aesthetic Canvas Tote',
    price: 3299,
    category: 'tote',
    description: 'A stylish and spacious canvas tote perfect for everyday use.',
    image: '/placeholder.svg?height=400&width=400'
  },
  {
    id: 2,
    name: 'Y2K Butterfly Necklace',
    price: 4799,
    category: 'jewelry',
    description: 'A trendy butterfly necklace inspired by Y2K fashion.',
    image: '/placeholder.svg?height=400&width=400'
  }
]

export async function GET() {
  try {
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error in GET /api/products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newProduct: Omit<Product, 'id'> = await request.json()
    console.log('Received new product:', newProduct)

    // Validate the new product
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.description) {
      return NextResponse.json({ error: 'Invalid product data' }, { status: 400 })
    }

    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    const productWithId = { id, ...newProduct }

    products.push(productWithId)
    console.log('Product added successfully:', productWithId)
    
    return NextResponse.json({ success: true, product: productWithId })
  } catch (error) {
    console.error('Error in POST /api/products:', error)
    return NextResponse.json({ 
      error: 'Failed to add product', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct: Product = await request.json()
    const index = products.findIndex(p => p.id === updatedProduct.id)
    
    if (index !== -1) {
      products[index] = updatedProduct
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  } catch (error) {
    console.error('Error in PUT /api/products:', error)
    return NextResponse.json({ 
      error: 'Failed to update product', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: number } = await request.json()
    const initialLength = products.length
    products = products.filter(p => p.id !== id)
    
    if (products.length === initialLength) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/products:', error)
    return NextResponse.json({ 
      error: 'Failed to delete product', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

